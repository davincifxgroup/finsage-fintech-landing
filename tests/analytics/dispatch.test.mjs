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
const optedOut = () => globalThis.window['ga-disable-G-TEST000000'] === true;
// What <AnalyticsPage> does when a known page mounts (one visit).
const TITLES = { home: 'ForexLAB Access', catalog: 'Expert Advisors | ForexLAB Access' };
function visit(mod, route, slug, mode = 'demo', title) {
  mod.registerPage(mod.analyticsPath(route, slug), mode, title ?? TITLES[route] ?? `${slug} | ForexLAB Access`);
  if (route === 'catalog') mod.track('catalog_view', {});
  if (route === 'advisor') mod.track('advisor_view', { advisor_slug: slug });
}

beforeEach(async () => {
  fakeWindow('https://access.example.test/');
  enabled = await load(ENABLED_ENV);
});

test('disabled build sends, queues and loads nothing even when window.gtag exists', () => {
  assert.equal(disabled.ANALYTICS_ENABLED, false);
  visit(disabled, 'catalog');
  disabled.pageView();
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
  enabled.pageView();
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
  assert.deepEqual(layer.map((a) => (a[0] === 'event' ? a[1] : a[0])), ['js', 'config', 'set', 'page_view', 'catalog_view']);
  assert.deepEqual(layer[1][2], { cookie_domain: 'auto', send_page_view: false });
});

test('a direct 404 or unknown advisor never loads the tag', () => {
  for (const href of ['https://access.example.test/advisors/unknown-thing', 'https://access.example.test/no/such/route']) {
    fakeWindow(href, { withGtag: false });
    enabled.registerPage(null, 'live'); // an unknown advisor resolves to no path
    enabled.syncPage();
    enabled.track('rebate_handoff_click', { cta_placement: 'header_login', destination: 'login' });
    enabled.pageView();
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
  enabled.pageView();

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
  enabled.registerPage(null, 'live');
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

test('a page restored from the back/forward cache is a new visit', () => {
  fakeWindow('https://access.example.test/advisors', { title: 'Expert Advisors' });
  visit(enabled, 'catalog');
  enabled.pageView();
  assert.equal(pageViews().length, 2);
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
