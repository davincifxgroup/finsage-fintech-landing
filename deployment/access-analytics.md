# ForexLAB Access — analytics

Shared plan, report setup, UTM convention, custom dimensions and privacy review:
`docs/analytics/analytics-plan.md` in the Rebate repository. This file covers the Access
side only.

**Off by default.** Nothing loads unless the build enables it, and it should stay off
until the owner approves the consent review in the shared plan.

## Build settings

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `true` to enable | Anything else = no GA4 loader at all |
| `NEXT_PUBLIC_GA4_ID` | the approved web stream ID (production: the Rebate/WordPress stream) | Use a test stream ID for review |
| `NEXT_PUBLIC_ANALYTICS_HOSTS` | default `access.ea-forexlab.com` | gtag.js loads only on these hostnames, so local and preview builds send nothing |
| `NEXT_PUBLIC_GA4_DEBUG_MODE` | `true` for DebugView | Test streams only |

`NEXT_PUBLIC_*` values are inlined at build time: rebuild after changing them.

## How it works

- `components/analytics/Analytics.tsx` (root layout): host check, then
  `gtag('config', ID, { cookie_domain: 'auto', catalog_mode })` and gtag.js. The `_ga`
  cookies live on `ea-forexlab.com`, shared with Rebate, so a visitor who moves on to
  Rebate keeps the same client and session (verified locally: same `cid` and `sid`).
- `catalog_mode` (`demo` / `live` / `empty`) is computed from the same cached catalog
  request the pages use and is set on every event, page views included.
- `components/analytics/AnalyticsClicks.tsx`: one click/auxclick delegate for links marked
  with `ctaAttributes()` from `lib/analytics.ts`. Never cancels or delays navigation;
  repeat within 800 ms counts once.
- `components/analytics/TrackView.tsx`: `catalog_view` and `advisor_view`, once per
  view, on direct loads and client-side navigation.
- `OnboardingAction` adds tracking only while onboarding is open. A closed "Coming soon"
  control has no tracking attributes and never sends an event.
- `lib/analytics.ts` allowlists every event, parameter and value (placements,
  destinations, catalog modes, public slug pattern).

## Events

| Event | Parameters |
|---|---|
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
node --experimental-strip-types --test tests/analytics/analytics.test.mjs
```
