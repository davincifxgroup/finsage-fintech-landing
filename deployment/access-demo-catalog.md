# Optional fictional catalog for vendor demonstrations

This frontend-only mode was requested by the owner after the presentation release.
It does not require a Django deployment, migrations, accounts, licenses or API data.
The approved page layout and the noindex metadata are retained.

- Default: ACCESS_CATALOG_DEMO is unset. The existing real API/empty-state behavior is unchanged.
- Demo: set ACCESS_CATALOG_DEMO=true in the frontend build and runtime environment.
  Build and run the same reviewed release with that setting.
- NEXT_PUBLIC_ACCESS_ONBOARDING must remain unset. Combining demo mode with
  NEXT_PUBLIC_ACCESS_ONBOARDING=open throws an error instead of serving the fixtures.
- Four fictional advisors use demo-prefixed slugs. Home, /advisors and the detail
  pages label them as fictional; prices and broker combinations are illustrative.
  No test results, dated approvals, reviews or article links are invented.
- Unknown slugs return 404 even if the real API happens to contain that slug.
- The real API is not contacted in demo mode. It is never mixed with the fixtures,
  and an API outage never automatically switches a normal release into demo mode.
- Advisor overview links and the full-catalog link work. Account creation, selection
  and vendor onboarding continue to render disabled Coming soon actions.

## Release procedure

Follow access-presentation-release.md: reviewed and pushed origin/main only, a new
release directory, pinned runtime/dependencies, production addresses, build checks,
local HTTP verification, and then switch current and restart forexlab-access.
No Nginx change is needed for an already-published presentation site.
Do not update the running release's files or reuse another preview's build.

Include ACCESS_CATALOG_DEMO=true in the build/runtime environment. This is not a
runtime-only switch: the home and catalog pages are prerendered, so changing this
setting requires a fresh build and restart.

Verify the Demo / Fictional labels, all four overview routes, the View all 4 advisors
link, an unknown slug's 404, noindex on HTML and headers, and disabled Access actions.
Check desktop and mobile layout. The release scanner's fictional matches are now
expected in this mode; localhost/demo-backend URLs and example.test remain forbidden.

To remove the demonstration, unset ACCESS_CATALOG_DEMO, build a new reviewed release
and switch to it. Or restore the previous presentation release and its environment,
then restart only forexlab-access. Keep the previous release for rollback.
Rebate, its database, WordPress, and backend financial/admission flags remain untouched.
