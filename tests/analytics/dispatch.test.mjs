// Dispatch gating, route-based page views and URL sanitizing in lib/analytics.ts.
//   node --experimental-strip-types --test tests/analytics/
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

let calls;

function fakeWindow(href, { referrer = '', title = 'ForexLAB Access', withGtag = true } = {}) {
  const url = new URL(href);
  calls = [];
  globalThis.window = {
    location: { href: url.href, hostname: url.hostname, pathname: url.pathname, origin: url.origin },
    addEventListener() {},
    removeEventListener() {},
    ...(withGtag ? { gtag: (...args) => calls.push(args) } : {}),
  };
  globalThis.document = { referrer, title };
}

function navigate(href, title) {
  const url = new URL(href);
  if (title !== undefined) globalThis.document.title = title;
  Object.assign(globalThis.window.location, { href: url.href, pathname: url.pathname, hostname: url.hostname, origin: url.origin });
}

// Disabled build: the default environment.
const disabled = await import('../../lib/analytics.ts?disabled');

// Enabled build for an allowed host. Each test gets a fresh module instance (page-view
// state is per page load), imported with the enabled environment.
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

// Enabled flag without confirming the stream setting stays off.
const unconfirmed = await load({ ...ENABLED_ENV, NEXT_PUBLIC_GA4_HISTORY_PAGEVIEWS_DISABLED: '' });

const pageViews = () => calls.filter((c) => c[0] === 'event' && c[1] === 'page_view');
const eventNames = () => calls.filter((c) => c[0] === 'event').map((c) => c[1]);
// What <AnalyticsPage> does on a known page.
const showPage = (mod, route, slug) => mod.registerPage(mod.analyticsPath(route, slug));

beforeEach(async () => {
  fakeWindow('https://access.example.test/');
  enabled = await load(ENABLED_ENV);
});

test('disabled build sends and queues nothing even when window.gtag exists', () => {
  assert.equal(disabled.ANALYTICS_ENABLED, false);
  showPage(disabled, 'home');
  disabled.pageView(true);
  disabled.track('catalog_view', { catalog_mode: 'demo' });
  assert.deepEqual(calls, []);
  assert.equal(globalThis.window.accessAnalytics, undefined);
});

test('enabling requires confirming that history-based page views are off', () => {
  assert.equal(unconfirmed.ANALYTICS_ENABLED, false);
});

test('disallowed hostname sends and queues nothing', () => {
  fakeWindow('https://localhost/advisors');
  showPage(enabled, 'catalog');
  enabled.track('catalog_view', { catalog_mode: 'demo' });
  enabled.pageView(true);
  assert.deepEqual(calls, []);
  assert.equal(globalThis.window.accessAnalytics, undefined);
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

test('a 404 or unknown advisor sends no page view and no events', () => {
  fakeWindow('https://access.example.test/advisors/unknown-private-thing?utm_source=telegram');
  enabled.registerPage(null); // what an unknown page amounts to: nothing registered
  enabled.pageView(true);
  enabled.track('advisor_view', { advisor_slug: 'unknown-private-thing', catalog_mode: 'live' });
  enabled.track('rebate_handoff_click', { cta_placement: 'header_login', destination: 'login', catalog_mode: 'live' });
  assert.deepEqual(calls, []);
});

test('a stale registration never labels another pathname', () => {
  fakeWindow('https://access.example.test/advisors/sample-ea', { title: 'Sample EA' });
  showPage(enabled, 'advisor', 'sample-ea');
  navigate('https://access.example.test/some/unknown/path', '404');
  enabled.pageView(true);
  enabled.track('access_cta_click', { cta_placement: 'catalog_card', destination: 'advisor_detail', catalog_mode: 'live' });
  assert.equal(pageViews().length, 1);
  assert.equal(pageViews()[0][2].page_location, 'https://access.example.test/advisors/sample-ea');
  assert.deepEqual(eventNames(), ['page_view']);
});

test('one page_view per visit; section jumps and repeats send nothing', () => {
  fakeWindow('https://access.example.test/?utm_source=telegram&utm_medium=social&email=a%40b.test#faq', {
    referrer: 'https://t.me/some/private/path?x=1',
    title: 'Ticket #4321 · jane@example.test',
  });
  showPage(enabled, 'home');
  showPage(enabled, 'home');
  enabled.pageView();
  navigate('https://access.example.test/#advisors');
  showPage(enabled, 'home');
  enabled.pageView();
  assert.equal(pageViews().length, 1);
  assert.deepEqual(pageViews()[0][2], {
    page_location: 'https://access.example.test/?utm_source=telegram&utm_medium=social',
    page_referrer: 'https://t.me/',
    page_title: 'Ticket #[id] · [email]',
  });
  assert.deepEqual(calls[0], ['set', pageViews()[0][2]]);

  navigate('https://access.example.test/advisors', 'Expert Advisors');
  showPage(enabled, 'catalog');
  navigate('https://access.example.test/', 'ForexLAB Access');
  showPage(enabled, 'home'); // back
  assert.deepEqual(pageViews().map((c) => c[2].page_location), [
    'https://access.example.test/?utm_source=telegram&utm_medium=social',
    'https://access.example.test/advisors',
    'https://access.example.test/',
  ]);
  assert.equal(pageViews()[1][2].page_referrer, 'https://access.example.test/');
});

test('a page restored from the back/forward cache is a new visit', () => {
  fakeWindow('https://access.example.test/advisors', { title: 'Expert Advisors' });
  showPage(enabled, 'catalog');
  enabled.pageView(true);
  assert.equal(pageViews().length, 2);
});

test('an event follows its page view', () => {
  navigate('https://access.example.test/advisors/sample-ea', 'Sample EA');
  showPage(enabled, 'advisor', 'sample-ea');
  enabled.track('advisor_view', { advisor_slug: 'sample-ea', catalog_mode: 'live' });
  assert.deepEqual(eventNames().slice(-2), ['page_view', 'advisor_view']);
});

test('calls made before the loader are queued only while active', () => {
  fakeWindow('https://access.example.test/advisors', { withGtag: false });
  showPage(enabled, 'catalog');
  enabled.track('catalog_view', { catalog_mode: 'demo' });
  const pending = globalThis.window.accessAnalytics.pending;
  assert.deepEqual(pending.map((args) => (args[0] === 'event' ? args[1] : args[0])), ['set', 'page_view', 'catalog_view']);
});

test('client-side view waits for the new title; its events stay behind it', async () => {
  fakeWindow('https://access.example.test/', { title: 'Home' });
  showPage(enabled, 'home');
  navigate('https://access.example.test/advisors/next-ea', '');
  showPage(enabled, 'advisor', 'next-ea');
  enabled.track('advisor_view', { advisor_slug: 'next-ea', catalog_mode: 'live' });
  assert.equal(pageViews().length, 1); // not yet: title still empty
  globalThis.document.title = 'Next EA | ForexLAB Access';
  await new Promise((r) => setTimeout(r, 120));
  assert.deepEqual(eventNames().slice(-2), ['page_view', 'advisor_view']);
  assert.equal(pageViews().at(-1)[2].page_title, 'Next EA | ForexLAB Access');
});

test('a view whose title never changes is sent after the wait', async () => {
  fakeWindow('https://access.example.test/', { title: 'Same' });
  showPage(enabled, 'home');
  navigate('https://access.example.test/advisors', 'Same');
  showPage(enabled, 'catalog');
  await new Promise((r) => setTimeout(r, 1150));
  assert.equal(pageViews().length, 2);
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
