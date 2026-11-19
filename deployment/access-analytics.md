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

Access sends its own page views (`send_page_view: false`): one per page visit, on the
first load, on every pathname change (client-side navigation, back/forward) and for pages
restored from the back/forward cache. `#section` jumps send nothing. With the history
setting on, GA4 would add its own page view for every client-side navigation and for
every `#faq` / `#advisors` jump the landing page pushes into history, and no tag option
can turn that off. The production stream `G-FFS5QEXYBR` has it on today, so changing it
is an owner decision (shared plan, section 7).

## How it works

- `components/analytics/Analytics.tsx` (root layout): host check, then
  `gtag('config', ID, { cookie_domain: 'auto', send_page_view: false, catalog_mode })`
  and gtag.js. `_ga` cookies live on `ea-forexlab.com`, shared with Rebate.
- `components/analytics/PageViews.tsx` + `pageView()` in `lib/analytics.ts`: the page
  views above. `page_location` = origin + path + campaign parameters with tag-like values
  only; `page_referrer` = origin; `page_title` with digit runs, `#123` and emails masked.
  After client-side navigation the view waits (≤1 s) for the new title, and that page's
  events are held behind it.
- `components/analytics/AnalyticsClicks.tsx`: click/auxclick delegate for links marked
  with `ctaAttributes()`. Never cancels or delays navigation; repeat within 800 ms counts
  once.
- `components/analytics/TrackView.tsx`: `catalog_view` and `advisor_view`, once per view.
- `OnboardingAction` adds tracking only while onboarding is open. A closed "Coming soon"
  control has no tracking attributes and never sends an event.
- `track()` / `pageView()` check the build flag and hostname before anything is sent or
  queued, even when `window.gtag` exists.

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
