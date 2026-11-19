// Dispatch gating, tag loading, visits and URL sanitizing in lib/analytics.ts.
//   node --experimental-strip-types --test tests/analytics/
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

let calls;
let scripts;

function fakeWindow(href, { referrer = '', title = 'ForexLAB Access', withGtag = true } = {}) {
  const url = new URL(href);
  calls = [];
  scripts = [];
  globalThis.window = {
    location: { href: url.href, hostname: url.hostname, pathname: url.pathname, origin: url.origin },
    addEventListener() {},
    removeEventListener() {},
    ...(withGtag ? { gtag: (...args) => calls.push(args) } : {}),
  };
  globalThis.document = {
    referrer,
    title,
    createElement: (tag) => ({ tag }),
    head: { appendChild: (el) => scripts.push(el) },
  };
}

function navigate(href, title) {
  const url = new URL(href);
  if (title !== undefined) globalThis.document.title = title;
  Object.assign(globalThis.window.location, { href: url.href, pathname: url.pathname, hostname: url.hostname, origin: url.origin });
}

// Each test gets a fresh module instance (state is per page load).
const ENABLED_ENV = {
  NEXT_PUBLIC_ANALYTICS_ENABLED: 'true',
  NEXT_PUBLIC_GA4_ID: 'G-TEST000000',
  NEXT_PUBLIC_GA4_HISTORY_PAGEVIEWS_DISABLED: 'true',
  NEXT_PUBLIC_ANALYTICS_HOSTS: 'access.example.test',
};
let loads = 0;
async function load(env) {
  const saved = { ...process.env };
  Object.assign(process.env, env);
  try {
    return await import(`../../lib/analytics.ts?load=${(loads += 1)}`);
  } finally {
    for (const key of Object.keys(env)) {
      if (key in saved) process.env[key] = saved[key];
      else delete process.env[key];
    }
  }
}
let enabled;
const disabled = await load({});
const unconfirmed = await load({ ...ENABLED_ENV, NEXT_PUBLIC_GA4_HISTORY_PAGEVIEWS_DISABLED: '' });

const pageViews = () => calls.filter((c) => c[0] === 'event' && c[1] === 'page_view');
const eventNames = () => calls.filter((c) => c[0] === 'event').map((c) => c[1]);
const KEY = 'ga-disable-G-TEST000000';
const optedOut = () => globalThis.window[KEY] === true;
// What <AnalyticsPage> does when a page mounts (one visit).
const TITLES = { home: 'ForexLAB Access', catalog: 'Expert Advisors | ForexLAB Access' };
function visit(mod, route, slug, mode = 'demo', title) {
  mod.registerPage(route, mode, title ?? TITLES[route] ?? `${slug} | ForexLAB Access`, slug);
}
// An unknown advisor: the page asks for a path that does not validate (treated as a 404).
const unknownAdvisor = (mod) => mod.registerPage('advisor', 'live', 'Advisor not found', 'Not A Slug');

beforeEach(async () => {
  fakeWindow('https://access.example.test/');
  enabled = await load(ENABLED_ENV);
});

test('disabled build sends, queues and loads nothing even when window.gtag exists', () => {
  assert.equal(disabled.ANALYTICS_ENABLED, false);
  visit(disabled, 'catalog');
  disabled.restoreVisit();
  disabled.syncPage();
  assert.deepEqual(calls, []);
  assert.deepEqual(scripts, []);
  assert.equal(globalThis.window.accessAnalytics, undefined);
});

test('enabling requires confirming that history-based page views are off', () => {
  assert.equal(unconfirmed.ANALYTICS_ENABLED, false);
});

test('disallowed hostname sends, queues and loads nothing', () => {
  fakeWindow('https://localhost/advisors');
  visit(enabled, 'catalog');
  enabled.restoreVisit();
  assert.deepEqual(calls, []);
  assert.deepEqual(scripts, []);
});

test('the tag is loaded and initialized only on a page the app confirms', () => {
  fakeWindow('https://access.example.test/advisors', { withGtag: false });
  enabled.syncPage(); // layout effect before any page confirmed itself
  assert.deepEqual(scripts, []);
  assert.equal(globalThis.window.gtag, undefined);
  visit(enabled, 'catalog');
  assert.equal(scripts.length, 1);
  assert.match(scripts[0].src, /googletagmanager\.com\/gtag\/js\?id=G-TEST000000/);
  const layer = globalThis.window.dataLayer.map((args) => Array.from(args));
  assert.deepEqual(layer.map((a) => (a[0] === 'event' ? a[1] : a[0])), ['set', 'js', 'config', 'set', 'page_view', 'catalog_view']);
  // Queued before 'js': stops the automatic page_view of tags that initialize the GA4
  // destination at gtm.init, before 'config' is read.
  assert.deepEqual(layer[0][1], { send_page_view: false });
  assert.deepEqual(layer[2][2], { cookie_domain: 'auto', send_page_view: false });
});

test('a direct 404 or unknown advisor never loads the tag', () => {
  for (const href of ['https://access.example.test/advisors/unknown-thing', 'https://access.example.test/no/such/route']) {
    fakeWindow(href, { withGtag: false });
    unknownAdvisor(enabled);
    enabled.syncPage();
    enabled.track('rebate_handoff_click', { cta_placement: 'header_login', destination: 'login' });
    enabled.restoreVisit();
    assert.deepEqual(scripts, []);
    assert.equal(globalThis.window.gtag, undefined);
    assert.equal(globalThis.window.dataLayer, undefined);
  }
});

test('analytics paths come from known routes and valid public slugs only', () => {
  assert.equal(enabled.analyticsPath('home'), '/');
  assert.equal(enabled.analyticsPath('catalog'), '/advisors');
  assert.equal(enabled.analyticsPath('advisor', 'sample-ea'), '/advisors/sample-ea');
  assert.equal(enabled.analyticsPath('advisor', 'demo-meridian-grid'), '/advisors/demo-meridian-grid');
  for (const bad of [undefined, '', 'Sample-EA', 'a/b', '../x', 'x?y=1', 'jane@example.test', 'a--b']) {
    assert.equal(enabled.analyticsPath('advisor', bad), null, String(bad));
  }
});

test('catalog -> 404 -> Back: exactly one more page_view, then one catalog_view', () => {
  fakeWindow('https://access.example.test/advisors', { title: 'Expert Advisors' });
  visit(enabled, 'catalog');
  assert.deepEqual(eventNames(), ['page_view', 'catalog_view']);
  assert.equal(optedOut(), false);

  navigate('https://access.example.test/no/such/route-jane%40example.test', '404: This page could not be found.');
  enabled.syncPage();
  assert.equal(optedOut(), true); // the gtag opt-out flag also stops automatic events
  enabled.track('access_cta_click', { cta_placement: 'catalog_card', destination: 'advisor_detail' });
  enabled.restoreVisit();

  navigate('https://access.example.test/advisors', 'Expert Advisors'); // Back remounts the catalog
  visit(enabled, 'catalog');
  enabled.syncPage();
  assert.equal(optedOut(), false);
  assert.deepEqual(eventNames(), ['page_view', 'catalog_view', 'page_view', 'catalog_view']);
  assert.ok(!JSON.stringify(calls).includes('such'));
});

test('advisor -> 404 -> Back: one page_view, then one advisor_view', () => {
  fakeWindow('https://access.example.test/advisors/sample-ea', { title: 'Sample EA' });
  visit(enabled, 'advisor', 'sample-ea', 'live');
  navigate('https://access.example.test/advisors/not-published', '404: This page could not be found.');
  unknownAdvisor(enabled);
  enabled.syncPage();
  navigate('https://access.example.test/advisors/sample-ea', 'Sample EA');
  visit(enabled, 'advisor', 'sample-ea', 'live');
  assert.deepEqual(eventNames(), ['page_view', 'advisor_view', 'page_view', 'advisor_view']);
  assert.ok(pageViews().every((c) => c[2].page_location === 'https://access.example.test/advisors/sample-ea'));
  assert.ok(!JSON.stringify(calls).includes('not-published'));
});

test('section jumps and route syncs on the same page send nothing', () => {
  fakeWindow('https://access.example.test/?utm_source=telegram&utm_medium=social&email=a%40b.test#faq', {
    referrer: 'https://t.me/some/private/path?x=1',
    title: 'Ticket #4321 · jane@example.test',
  });
  visit(enabled, 'home', undefined, 'demo', 'Ticket #4321 · jane@example.test');
  navigate('https://access.example.test/#advisors');
  enabled.syncPage();
  navigate('https://access.example.test/#how-it-works');
  enabled.syncPage();
  assert.equal(pageViews().length, 1);
  assert.deepEqual(pageViews()[0][2], {
    page_location: 'https://access.example.test/?utm_source=telegram&utm_medium=social',
    page_referrer: 'https://t.me/',
    page_title: 'Ticket #[id] · [email]',
    catalog_mode: 'demo',
  });
  assert.equal(optedOut(), false);
});

test('back/forward between known pages: one page_view per visit', () => {
  fakeWindow('https://access.example.test/advisors/sample-ea', { title: 'Sample EA' });
  visit(enabled, 'advisor', 'sample-ea');
  navigate('https://access.example.test/advisors', 'Expert Advisors');
  visit(enabled, 'catalog');
  enabled.syncPage();
  navigate('https://access.example.test/advisors/sample-ea', 'Sample EA'); // back
  visit(enabled, 'advisor', 'sample-ea');
  enabled.syncPage();
  navigate('https://access.example.test/advisors', 'Expert Advisors'); // forward
  visit(enabled, 'catalog');
  enabled.syncPage();
  assert.deepEqual(eventNames(), [
    'page_view', 'advisor_view', 'page_view', 'catalog_view', 'page_view', 'advisor_view', 'page_view', 'catalog_view',
  ]);
  assert.equal(pageViews()[1][2].page_referrer, 'https://access.example.test/');
});

test('back/forward cache restore: catalog sends one page_view then one catalog_view', () => {
  fakeWindow('https://access.example.test/advisors', { title: 'Expert Advisors' });
  visit(enabled, 'catalog');
  calls.length = 0;
  enabled.restoreVisit();
  assert.deepEqual(eventNames(), ['page_view', 'catalog_view']);
  assert.equal(pageViews()[0][2].page_location, 'https://access.example.test/advisors');
});

test('back/forward cache restore: advisor sends one page_view then advisor_view with slug and mode', () => {
  fakeWindow('https://access.example.test/advisors/sample-ea', { title: 'Sample EA' });
  visit(enabled, 'advisor', 'sample-ea', 'live', 'Sample EA | ForexLAB Access');
  calls.length = 0;
  enabled.restoreVisit();
  assert.deepEqual(eventNames(), ['page_view', 'advisor_view']);
  const advisorView = calls.find((c) => c[0] === 'event' && c[1] === 'advisor_view');
  assert.deepEqual(advisorView[2], { advisor_slug: 'sample-ea', catalog_mode: 'live' });
  assert.equal(pageViews()[0][2].page_title, 'Sample EA | ForexLAB Access');
});

test('back/forward cache restore: home sends only page_view; 404 and section jumps send nothing', () => {
  fakeWindow('https://access.example.test/', { title: 'ForexLAB Access' });
  visit(enabled, 'home');
  calls.length = 0;
  enabled.restoreVisit();
  assert.deepEqual(eventNames(), ['page_view']);

  navigate('https://access.example.test/#faq');
  enabled.syncPage();
  assert.deepEqual(eventNames(), ['page_view']);

  navigate('https://access.example.test/no/such/route', '404: This page could not be found.');
  enabled.syncPage();
  enabled.restoreVisit(); // a restored 404
  assert.deepEqual(eventNames(), ['page_view']);
});

test('a pre-existing visitor opt-out: no tag, no queued events, no requests, also across a 404', () => {
  fakeWindow('https://access.example.test/advisors', { withGtag: false });
  globalThis.window[KEY] = true;
  visit(enabled, 'catalog');
  enabled.track('access_cta_click', { cta_placement: 'catalog_card', destination: 'advisor_detail' });
  enabled.restoreVisit();
  navigate('https://access.example.test/no/such/route', '404');
  enabled.syncPage();
  navigate('https://access.example.test/advisors', 'Expert Advisors');
  visit(enabled, 'catalog');
  enabled.syncPage();
  assert.deepEqual(scripts, []);
  assert.equal(globalThis.window.gtag, undefined);
  assert.equal(globalThis.window.dataLayer, undefined);
  assert.equal(globalThis.window.accessAnalytics, undefined);
  assert.equal(globalThis.window[KEY], true); // never overwritten
});

test('an opt-out set after the tag loaded survives a 404 and the return', () => {
  fakeWindow('https://access.example.test/advisors', { title: 'Expert Advisors' });
  visit(enabled, 'catalog');
  assert.deepEqual(eventNames(), ['page_view', 'catalog_view']);
  globalThis.window[KEY] = true; // the visitor (or a consent tool) opts out
  enabled.track('access_cta_click', { cta_placement: 'catalog_card', destination: 'advisor_detail' });
  navigate('https://access.example.test/no/such/route', '404');
  enabled.syncPage();
  assert.equal(optedOut(), true);
  navigate('https://access.example.test/advisors', 'Expert Advisors');
  visit(enabled, 'catalog'); // returning lifts only Access's pause
  enabled.syncPage();
  enabled.restoreVisit();
  assert.equal(optedOut(), true);
  assert.deepEqual(eventNames(), ['page_view', 'catalog_view']);
});

test("Access's 404 pause is lifted on return, and a later opt-in by the visitor is respected", () => {
  fakeWindow('https://access.example.test/advisors', { title: 'Expert Advisors' });
  visit(enabled, 'catalog');
  navigate('https://access.example.test/no/such/route', '404');
  enabled.syncPage();
  assert.equal(optedOut(), true); // paused by Access
  globalThis.window[KEY] = false; // a visitor write does not lift the pause on a 404
  assert.equal(optedOut(), true);
  navigate('https://access.example.test/advisors', 'Expert Advisors');
  visit(enabled, 'catalog');
  assert.equal(optedOut(), false);
  assert.deepEqual(eventNames(), ['page_view', 'catalog_view', 'page_view', 'catalog_view']);
});

test("page_title is the page's own title, even when document.title is stale", () => {
  fakeWindow('https://access.example.test/', { title: 'ForexLAB Access' });
  visit(enabled, 'home');
  navigate('https://access.example.test/advisors/next-ea', '404: This page could not be found.');
  visit(enabled, 'advisor', 'next-ea', 'live', 'Next EA | ForexLAB Access');
  assert.deepEqual(eventNames(), ['page_view', 'page_view', 'advisor_view']);
  assert.equal(pageViews()[1][2].page_title, 'Next EA | ForexLAB Access');
});

test('shared campaign value examples (same file as Rebate)', () => {
  const examples = JSON.parse(readFileSync(new URL('./campaign-value-examples.json', import.meta.url), 'utf8'));
  assert.ok(examples.accepted.length >= 10 && examples.rejected.length >= 10);
  for (const [key, value] of examples.accepted) {
    assert.equal(enabled.isSafeCampaignValue(key, value), true, `accepted ${key}=${value}`);
  }
  for (const [key, value] of examples.rejected) {
    assert.equal(enabled.isSafeCampaignValue(key, value), false, `rejected ${key}=${value}`);
  }
});

test('unsafe campaign values are dropped from page_location', () => {
  assert.equal(
    enabled.sanitizedLocation(
      'https://access.example.test/raw/path?utm_source=telegram&utm_medium=social&utm_campaign=rebate_launch' +
        '&utm_content=pinned_post&utm_term=415+555+0123&utm_id=415.555.0123&ref=x#top',
      '/advisors',
    ),
    'https://access.example.test/advisors?utm_source=telegram&utm_medium=social&utm_campaign=rebate_launch&utm_content=pinned_post',
  );
});

test('debug build adds debug_mode: true to every event; a normal build never sends it', async () => {
  const debug = await load({ ...ENABLED_ENV, NEXT_PUBLIC_GA4_DEBUG_MODE: 'true' });
  for (const [mod, on] of [[debug, true], [enabled, false]]) {
    fakeWindow('https://access.example.test/advisors');
    visit(mod, 'catalog');
    mod.track('rebate_handoff_click', { cta_placement: 'catalog_card', destination: 'register' });
    const events = calls.filter((c) => c[0] === 'event');
    assert.deepEqual(events.map((c) => c[1]), ['page_view', 'catalog_view', 'rebate_handoff_click']);
    for (const [, name, params] of events) {
      if (on) assert.equal(params.debug_mode, true, name);
      else assert.equal('debug_mode' in params, false, name);
    }
    // Page fields set for later hits never carry it, and one page_view per visit.
    for (const c of calls.filter((c) => c[0] === 'set')) assert.equal('debug_mode' in c[1], false);
    assert.equal(pageViews().length, 1);
    // The local log of sent events stays the allowlisted params only.
    for (const entry of globalThis.window.accessAnalytics.sent) assert.equal('debug_mode' in entry.params, false);
  }
});
