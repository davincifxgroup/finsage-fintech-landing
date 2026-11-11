# ForexLAB Access catalog integration

The advisor catalog comes from the ForexLAB Rebate (Django) project, which is the only
source of truth (`apps/access_catalog`, branch `codex/access-catalog`; see its
`docs/access-catalog.md`). This site reads Django's **public, read-only JSON API** on
the server. It never reads Django's database and keeps no copy of the catalog.

## Data contract (API version 1)

| Request | Response |
|---|---|
| `GET {API}/advisors/` | `{ version: 1, generatedAt, advisors: AdvisorCard[] }` |
| `GET {API}/advisors/{slug}/` | `{ version: 1, advisor: AdvisorDetail }`, or 404 if not public |

Types are in `lib/catalog.ts`. Prices are Decimal strings in USD (for example
`"1250.00"`) and are only formatted for display, never calculated. Only published,
complete advisors of active vendors are returned; vendor data is the public display
name only.

## Pages

- **`/`**: the homepage advisor panel lists up to three published advisors with their
  license price, plus "View all advisors". With none, it shows the existing empty state.
- **`/advisors`**: all published advisors, or the same honest empty state.
- **`/advisors/{slug}`**: description, dated evaluation evidence, known limitations,
  approved broker compatibility, current license price, license and support terms. It
  states that license applications are not open yet. Unknown, draft and unpublished
  slugs give 404.

Authentication links go to Rebate (`lib/site.ts`). No activation flow is implied.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `ACCESS_CATALOG_API_URL` | `${NEXT_PUBLIC_REBATE_URL}/api/access/catalog` | API base (server side only) |
| `ACCESS_CATALOG_REVALIDATE_SECONDS` | `60` | Incremental revalidation. `0` = always fresh, for local review. |

If the API is unreachable, the pages show the empty state and log
`[access-catalog] … unavailable`. Nothing is invented or cached locally.

## Local startup

1. In the Rebate project, on branch `codex/access-catalog`, start the API on a
   disposable database (see `config/settings_catalog_local.py`):
   ```bash
   export DJANGO_SETTINGS_MODULE=config.settings_catalog_local   # PowerShell: $env:DJANGO_SETTINGS_MODULE = "config.settings_catalog_local"
   python manage.py migrate
   python manage.py seed_demo
   python manage.py createsuperuser
   python manage.py runserver 127.0.0.1:8766
   ```
   In `/admin/`, add a vendor and an advisor, then publish the advisor.
2. In this project:
   ```bash
   export ACCESS_CATALOG_API_URL=http://127.0.0.1:8766/api/access/catalog ACCESS_CATALOG_REVALIDATE_SECONDS=0
   corepack pnpm build
   corepack pnpm start --hostname 127.0.0.1 --port 3300
   ```
   Then open http://127.0.0.1:3300.
