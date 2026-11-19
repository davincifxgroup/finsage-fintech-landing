// Dispatch gating, page views and URL sanitizing in lib/analytics.ts.
//   node --experimental-strip-types --test tests/analytics/
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

let calls;

function fakeWindow(href, { referrer = '', title = 'ForexLAB Access', withGtag = true } = {}) {
  const url = new URL(href);
  calls = [];
  globalThis.window = {
    location: {
      href: url.href,
      hostname: url.hostname,
      pathname: url.pathname,
      origin: url.origin,
    },
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

// Enabled build for an allowed host (module re-imported with a fresh env).
process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = 'true';
process.env.NEXT_PUBLIC_GA4_ID = 'G-TEST000000';
process.env.NEXT_PUBLIC_GA4_HISTORY_PAGEVIEWS_DISABLED = 'true';
process.env.NEXT_PUBLIC_ANALYTICS_HOSTS = 'access.example.test';
const enabled = await import('../../lib/analytics.ts?enabled');

// Enabled flag without confirming the stream setting stays off.
delete process.env.NEXT_PUBLIC_GA4_HISTORY_PAGEVIEWS_DISABLED;
const unconfirmed = await import('../../lib/analytics.ts?unconfirmed');

const pageViews = () => calls.filter((c) => c[0] === 'event' && c[1] === 'page_view');

beforeEach(() => fakeWindow('https://access.example.test/'));

test('disabled build sends and queues nothing even when window.gtag exists', () => {
  assert.equal(disabled.ANALYTICS_ENABLED, false);
  disabled.pageView();
  disabled.track('catalog_view', { catalog_mode: 'demo' });
  assert.deepEqual(calls, []);
  assert.equal(globalThis.window.accessAnalytics, undefined);
});

test('enabling requires confirming that history-based page views are off', () => {
  assert.equal(unconfirmed.ANALYTICS_ENABLED, false);
});

test('disallowed hostname sends and queues nothing', () => {
  fakeWindow('https://localhost/');
  enabled.track('catalog_view', { catalog_mode: 'demo' });
  enabled.pageView(true);
  assert.deepEqual(calls, []);
  assert.equal(globalThis.window.accessAnalytics, undefined);
});

test('one page_view per pathname; section jumps and repeats send nothing', () => {
  fakeWindow('https://access.example.test/?utm_source=telegram&utm_medium=social&email=a%40b.test#faq', {
    referrer: 'https://t.me/some/private/path?x=1',
    title: 'Ticket #4321 · jane@example.test',
  });
  enabled.pageView(true);
  enabled.pageView();
  navigate('https://access.example.test/#advisors');
  enabled.pageView();
  assert.equal(pageViews().length, 1);
  assert.deepEqual(pageViews()[0][2], {
    page_location: 'https://access.example.test/?utm_source=telegram&utm_medium=social',
    page_referrer: 'https://t.me/',
    page_title: 'Ticket #[id] · [email]',
  });
  assert.deepEqual(calls[0], ['set', pageViews()[0][2]]);

  navigate('https://access.example.test/advisors', 'Expert Advisors');
  enabled.pageView();
  navigate('https://access.example.test/', 'ForexLAB Access');
  enabled.pageView(); // back
  assert.deepEqual(pageViews().map((c) => c[2].page_location), [
    'https://access.example.test/?utm_source=telegram&utm_medium=social',
    'https://access.example.test/advisors',
    'https://access.example.test/',
  ]);
  assert.equal(pageViews()[1][2].page_referrer, 'https://access.example.test/');
});

test('an event on a new page is preceded by that page view', () => {
  navigate('https://access.example.test/advisors/sample-ea', 'Sample EA');
  enabled.track('advisor_view', { advisor_slug: 'sample-ea', catalog_mode: 'live' });
  const names = calls.filter((c) => c[0] === 'event').map((c) => c[1]);
  assert.deepEqual(names.slice(-2), ['page_view', 'advisor_view']);
});

test('calls made before the loader are queued only while active', () => {
  fakeWindow('https://access.example.test/queued', { withGtag: false });
  enabled.track('catalog_view', { catalog_mode: 'demo' });
  const pending = globalThis.window.accessAnalytics.pending;
  assert.deepEqual(pending.map((args) => (args[0] === 'event' ? args[1] : args[0])), ['set', 'page_view', 'catalog_view']);
});

test('campaign values must be tag-like', () => {
  for (const [key, value] of [
    ['utm_source', 'vendor_outreach'], ['utm_campaign', 'access_demo'], ['utm_content', 'intro'],
    ['utm_term', 'ea trading'], ['gclid', 'Cj0KCQiA_example-Click_Id123'],
  ]) {
    assert.equal(enabled.isSafeCampaignValue(key, value), true, `${key}=${value}`);
  }
  for (const [key, value] of [
    ['utm_source', 'name@example.test'], ['utm_content', '4155550123'], ['utm_campaign', 'https://x.test'],
    ['utm_term', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4'], ['gclid', 'short'],
  ]) {
    assert.equal(enabled.isSafeCampaignValue(key, value), false, `${key}=${value}`);
  }
  assert.equal(
    enabled.sanitizedLocation('https://access.example.test/advisors?utm_source=a%40b.test&utm_medium=email&ref=x#top'),
    'https://access.example.test/advisors?utm_medium=email',
  );
});

test('client-side view waits for the new title; its events stay behind it', async () => {
  fakeWindow('https://access.example.test/', { title: 'Home' });
  enabled.pageView(true);
  navigate('https://access.example.test/advisors/next-ea', '');
  enabled.pageView();
  enabled.track('advisor_view', { advisor_slug: 'next-ea', catalog_mode: 'live' });
  assert.equal(pageViews().length, 1); // not yet: title still empty
  globalThis.document.title = 'Next EA | ForexLAB Access';
  await new Promise((r) => setTimeout(r, 120));
  const events = calls.filter((c) => c[0] === 'event').map((c) => c[1]);
  assert.deepEqual(events.slice(-2), ['page_view', 'advisor_view']);
  assert.equal(pageViews().at(-1)[2].page_title, 'Next EA | ForexLAB Access');
});

test('a view whose title never changes is sent after the wait', async () => {
  fakeWindow('https://access.example.test/', { title: 'Same' });
  enabled.pageView(true);
  navigate('https://access.example.test/other', 'Same');
  enabled.pageView();
  await new Promise((r) => setTimeout(r, 1150));
  assert.equal(pageViews().length, 2);
});
