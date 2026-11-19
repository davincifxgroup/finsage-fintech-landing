# ForexLAB Access — analytics

Shared plan, report setup, UTM convention, custom dimensions and privacy review:
`docs/analytics/analytics-plan.md` in the Rebate repository. This file covers the Access
side only.

**Off by default.** Nothing loads unless the build enables it, and it should stay off
until the owner approves the consent review in the shared plan.

## Build settings

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `true` to enable | Anything else = no loader, no events |
| `NEXT_PUBLIC_GA4_ID` | the approved web stream ID (production: the Rebate/WordPress stream) | Use a test stream ID for review |
| `NEXT_PUBLIC_GA4_HISTORY_PAGEVIEWS_DISABLED` | `true` | Required. Confirms the stream's Enhanced Measurement "Page changes based on browser history events" is **off** (see below). Without it analytics stays off |
| `NEXT_PUBLIC_ANALYTICS_HOSTS` | default `access.ea-forexlab.com` | Every send checks the hostname; other hosts send and queue nothing |
| `NEXT_PUBLIC_GA4_DEBUG_MODE` | `true` for DebugView | Test streams only |
| `NEXT_PUBLIC_GA4_TRANSPORT_URL` | local capture server URL | Review only; never in production |

`NEXT_PUBLIC_*` values are inlined at build time: rebuild after changing them.

## Why the stream setting is required

Access sends its own page views (`send_page_view: false`): one per visit to a known
page — first load, client-side navigation, back/forward (including back from a 404) and
pages restored from the back/forward cache. `#section` jumps send nothing. With the
history setting on, GA4 would add its own page view for every client-side navigation and
for every `#faq` / `#advisors` jump the landing page pushes into history, and no tag
option can turn that off. The production stream `G-FFS5QEXYBR` has it on today, so
changing it is an owner decision (shared plan, section 7).

## How it works

- **The tag loads only on a page the app confirms.** `components/analytics/Analytics.tsx`
  (root layout) does not load gtag.js. The first `<AnalyticsPage>` to mount — on `/`,
  `/advisors`, or an advisor the page actually rendered — loads and initializes it
  (`gtag('config', ID, { cookie_domain: 'auto', send_page_view: false })`). A direct
  visit to a 404 or an unknown advisor never loads or initializes the tag. `_ga` cookies
  live on `ea-forexlab.com`, shared with Rebate.
- **One visit per `<AnalyticsPage>` mount** (`registerPage()` in `lib/analytics.ts`):
  `page_view`, then `catalog_view` / `advisor_view`. Returning to a page (back/forward,
  or back from a 404) remounts it and is a new visit; `#section` jumps do not remount and
  send nothing.
- **Paths and titles come from the page, never from the URL or `document.title`:**
  `/`, `/advisors`, `/advisors/<slug>` (published listing or labeled demo fixture; slug
  validated) and the page's own title (the same constant as its metadata).
  `page_location` = origin + that path + campaign parameters with safe values only (same
  rules and examples as Rebate: `tests/analytics/campaign-value-examples.json`);
  `page_referrer` = origin; `catalog_mode` from the page.
- **Leaving for an unconfirmed page:** `components/analytics/PageViews.tsx` checks every
  route change. If no known page claims the new pathname (client-side navigation to a 404
  or unknown advisor after the tag is loaded), custom events stop and gtag's documented
  opt-out flag `window['ga-disable-<ID>'] = true` stops all hits, automatic ones
  included, until a known page confirms itself again. It also re-sends the view for pages
  restored from the back/forward cache.
- `components/analytics/AnalyticsClicks.tsx`: click/auxclick delegate for links marked
  with `ctaAttributes()`. Never cancels or delays navigation; repeat within 800 ms counts
  once.
- `OnboardingAction` adds tracking only while onboarding is open. A closed "Coming soon"
  control has no tracking attributes and never sends an event.
- `track()` / `pageView()` check the build flag and hostname before anything is sent,
  even when `window.gtag` exists.

**Stream dependencies:** the opt-out flag covers every hit gtag sends from the page, so
404s stay silent regardless of Enhanced Measurement settings. Duplicate-free page views
still require "Page changes based on browser history events" to be off (above).

## Events

| Event | Parameters |
|---|---|
| `page_view` | `page_location`, `page_referrer`, `page_title`, `catalog_mode` |
| `access_cta_click` | `cta_placement`, `destination` (`advisors_section`, `catalog`, `advisor_detail`), `advisor_slug`, `catalog_mode` |
| `catalog_view` | `catalog_mode` |
| `advisor_view` | `advisor_slug`, `catalog_mode` |
| `rebate_handoff_click` | `cta_placement`, `destination` (`login`, `dashboard`, `register`, `vendor_portal`, `support`, `rebate_home`), `advisor_slug`, `catalog_mode` |

Placements: `hero_primary`, `hero_login`, `header_login`, `header_vendor`,
`roles_advisor`, `roles_view_all`, `roles_create_account`, `catalog_card`,
`catalog_empty_create_account`, `advisor_detail_back`, `advisor_detail_get_advisor`,
`advisor_detail_create_account`, `final_cta`, `faq_setup_request`, `footer_login`,
`footer_vendor`, `footer_register`, `footer_dashboard`, `footer_rebate`.

No UTMs on links to Rebate or the main site. Demo engagement (`catalog_mode=demo`) is
reported separately from live.

## Checks

```powershell
node --experimental-strip-types --test tests/analytics/analytics.test.mjs tests/analytics/dispatch.test.mjs
```

`tests/analytics/campaign-value-examples.json` must stay identical to the Rebate file
`apps/core/testdata/campaign_value_examples.json`.
