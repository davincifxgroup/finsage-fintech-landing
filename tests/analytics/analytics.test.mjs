// Allowlist checks for lib/analytics.ts (deployment/access-analytics.md).
//   node --experimental-strip-types --test tests/analytics/
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ANALYTICS_ENABLED, catalogModeOf, cleanParams, ctaAttributes } from '../../lib/analytics.ts';

test('analytics is off unless the build enables it', () => {
  assert.equal(ANALYTICS_ENABLED, false);
});

test('catalog mode separates demo, live and empty', () => {
  assert.equal(catalogModeOf([]), 'empty');
  assert.equal(catalogModeOf([{ demo: true }, { demo: true }]), 'demo');
  assert.equal(catalogModeOf([{}]), 'live');
});

test('only allowlisted parameters and values are sent', () => {
  assert.deepEqual(
    cleanParams('rebate_handoff_click', {
      cta_placement: 'header_login',
      destination: 'login',
      catalog_mode: 'demo',
      email: 'someone@example.test',
      page_url: 'https://rebate.ea-forexlab.com/login?next=/dashboard/',
    }),
    { cta_placement: 'header_login', destination: 'login', catalog_mode: 'demo' },
  );
  assert.deepEqual(cleanParams('rebate_handoff_click', { cta_placement: 'somewhere_else', destination: 'https://x.test' }), {});
  assert.equal(cleanParams('unknown_event', { a: 'b' }), null);
});

test('advisor slugs must be public slugs', () => {
  assert.deepEqual(cleanParams('advisor_view', { advisor_slug: 'sample-ea', catalog_mode: 'live' }), {
    advisor_slug: 'sample-ea',
    catalog_mode: 'live',
  });
  assert.deepEqual(cleanParams('advisor_view', { advisor_slug: 'Bad Slug/../x' }), {});
});

test('in-site and Rebate destinations map to separate events', () => {
  assert.equal(ctaAttributes('roles_view_all', 'catalog')['data-analytics-event'], 'access_cta_click');
  assert.equal(ctaAttributes('header_login', 'login')['data-analytics-event'], 'rebate_handoff_click');
  assert.equal(ctaAttributes('catalog_card', 'advisor_detail', 'sample-ea')['data-analytics-advisor-slug'], 'sample-ea');
});
