# Approved homepage baseline

The ForexLAB Access homepage below is approved as final by the owner (16 November 2026).
It is the visual baseline for all later work.

| | |
|---|---|
| Repository | ForexLAB Access Finsage |
| Branch | `access-policy-v2` |
| Commit | `2a946970947f29832ae4d19de995179140288c59` (`2a94697`, "Cancel superseded and disposed section-navigation landings") |
| Framework | Next.js 16.3.2, production build (`next build`, served with `next start`) |
| Reviewed build | `BUILD_ID` `EZ0A4k113oIDVF0IUX4Kv`, built 2026-11-16 14:48:32 UTC |
| Review preview | http://127.0.0.1:3382/, paired with the demo backend http://127.0.0.1:8783/ |

The reviewed build was made with demo-only environment values:
`NEXT_PUBLIC_REBATE_URL=http://127.0.0.1:8783`,
`ACCESS_CATALOG_API_URL=http://127.0.0.1:8783/api/access/catalog`,
`ACCESS_CATALOG_REVALIDATE_SECONDS=0`. A production build must use the same commit with the
production values; the build ID is local and differs per build.

## Rules

- Do not change the homepage layout, copy, animations or interactions without a new
  explicit request from the owner.
- Necessary legal-link updates (Terms, Privacy, Access Terms) may be made without
  redesigning the page.
- Any approved change is recorded here as a new baseline entry with its commit and build.
