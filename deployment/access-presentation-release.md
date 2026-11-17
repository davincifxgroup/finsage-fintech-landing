# ForexLAB Access — presentation-only release

Replace the 503 preparation placeholder at `https://access.ea-forexlab.com` with the
reviewed Next.js site, viewable by link but not indexed, with Access onboarding shown
as "Coming soon". Nothing else on the server changes: the Rebate application, its
Nginx site, its `.env`, its database and the WordPress site stay as they are.

This follows the rules of the tracked Rebate runbook
(`eaforexlab-rebate/docs/deploy/agent-deploy-plan.md`): run one step at a time and
inspect the result, deploy only a reviewed and pushed `origin/main` commit, stop on
any warning, test Nginx before every reload, and never paste secrets into chat or
notes. The Access site needs no secrets.

## What this release is

- Next.js production server (`next start`), bound to `127.0.0.1` only, run by systemd
  as its own unprivileged user, reached only through the existing Access Nginx site.
- Built **on the server** from the reviewed commit with production addresses. The
  local review build (localhost addresses) is never uploaded.
- Catalog: `ACCESS_CATALOG_API_URL=https://rebate.ea-forexlab.com/api/access/catalog`.
  Production Rebate does not serve the catalog API yet (HTTP 404), so the site shows
  its honest empty state ("The first advisors are in evaluation"). Advisors appear
  only after the Rebate backend publishes real ones; nothing fictional is shipped.
- Onboarding closed: `NEXT_PUBLIC_ACCESS_ONBOARDING` is **unset**. Create account,
  advisor selection, vendor portal, assisted setup and Access Terms read
  "Coming soon". This is presentation only; admission is enforced by the Rebate
  server, which stays closed:

  ```text
  ACCESS_ADMISSION_MODE=closed
  ACCESS_COMMISSION_CAPTURE_ENABLED=False
  ACCESS_ALLOCATION_ENABLED=False
  ACCESS_VENDOR_WITHDRAWALS_ENABLED=False
  ```

  (Production Rebate does not contain the Access code yet; these flags apply when it
  is deployed. Do not change them for this release.)
- Not indexed, two independent layers:
  - every page: `<meta name="robots" content="noindex, nofollow, noarchive">`;
  - every response: `X-Robots-Tag: noindex, nofollow, noarchive` from Nginx
    (`add_header ... always`).
  No `robots.txt` Disallow is added — it would stop crawlers from reading the noindex.
  WordPress and Rebate indexing settings are not touched.

## Planned layout (confirm against step 0 first)

```text
Operator:       deployadmin (sudo)
Service user:   forexlab-access (system user, no login shell)
Base:           /srv/forexlab-access
Release:        /srv/forexlab-access/releases/<commit>   (git checkout + build)
Current:        /srv/forexlab-access/current -> releases/<commit>
Environment:    /etc/forexlab-access/access.env           (non-secret build/run values)
Service:        forexlab-access.service  -> next start --hostname 127.0.0.1 --port <PORT>
Port:           <PORT> = 3100 unless step 0 shows it in use
Node.js:        latest patched 22 LTS, official checksummed binary in /opt/node-v22,
                used for both the build and the service (never the system `node`)
Nginx site:     /etc/nginx/sites-available/eaforexlab-access (edited in place, backup kept)
```

## Step 0 — read-only server checks (run first, one at a time)

Run as `deployadmin`. None of these change anything, and none print secrets. Share each
output before running the next.

0a. The current Access site config and which sites are enabled:

```bash
sudo cat /etc/nginx/sites-available/eaforexlab-access
ls -l /etc/nginx/sites-enabled/
```

0b. Nginx version, configuration test and service states:

```bash
nginx -v
sudo nginx -t
systemctl is-active nginx eaforexlab-rebate
```

0c. Operating system, architecture and any existing Node.js:

```bash
lsb_release -ds; uname -m
command -v node && node --version || echo "no node on PATH"
ls -d /opt/node-* 2>/dev/null || echo "no /opt/node-*"
```

0d. Listening ports (is 3100 free?):

```bash
sudo ss -ltnp | grep -E ':(80|443|3000|3100)\s' || echo "none of 3000/3100 in use"
```

0e. Existing directories, users and units with the planned names:

```bash
ls -ld /srv/* /etc/forexlab-access 2>&1
getent passwd forexlab-access || echo "no forexlab-access user"
systemctl list-unit-files 'forexlab-access*' --no-legend || true
```

0f. Free disk space and memory:

```bash
df -h /; free -m
```

The exact Nginx edit in step 7 is written from the real file (0a), not from this
template.

## Step 1 — record state and back up the Access site config

```bash
sudo install -d -m 700 /root/forexlab-access-backups
sudo cp -a /etc/nginx/sites-available/eaforexlab-access /root/forexlab-access-backups/eaforexlab-access.placeholder-$(date -u +%Y%m%dT%H%M%SZ)
sudo ls -l /root/forexlab-access-backups/
curl -sI https://access.ea-forexlab.com/ | head -5
curl -s -o /dev/null -w '%{http_code}\n' https://rebate.ea-forexlab.com/login
```

The backup lives outside `/etc/nginx`, so Nginx can never load it. The Rebate
pre-deploy database backup is not required: nothing touches Rebate data.

## Step 2 — Node.js 22 LTS in /opt/node-v22

Always install the dedicated runtime, even if step 0 found a `node` already. A system
Node is not accepted just because it is >= 20.9: Node 20 is end-of-life, and the build
and the service must use one known, patched runtime at one fixed path. The command
below takes the latest 22.x release (the current patched 22 LTS) and verifies its
checksum. Another supported LTS line (for example 24) may be used only after checking
that it is in Active or Maintenance LTS on nodejs.org/en/about/previous-releases and
that the build passes with it; then replace `/opt/node-v22` consistently in steps 5
and 6.

If step 0 showed `/opt/node-v22` already present, stop and report its version instead
of overwriting it.

```bash
cd /tmp
NODE_VER=$(curl -fsSL https://nodejs.org/dist/latest-v22.x/SHASUMS256.txt | grep -oE 'node-v22\.[0-9]+\.[0-9]+-linux-x64\.tar\.xz' | head -1 | sed 's/^node-//; s/-linux-x64\.tar\.xz$//')
echo "$NODE_VER"
curl -fsSLO "https://nodejs.org/dist/$NODE_VER/node-$NODE_VER-linux-x64.tar.xz"
curl -fsSL "https://nodejs.org/dist/$NODE_VER/SHASUMS256.txt" | grep " node-$NODE_VER-linux-x64.tar.xz$" | sha256sum -c -
sudo mkdir -p /opt/node-v22 && sudo tar -xJf "node-$NODE_VER-linux-x64.tar.xz" -C /opt/node-v22 --strip-components=1
/opt/node-v22/bin/node --version
/opt/node-v22/bin/corepack --version
rm "node-$NODE_VER-linux-x64.tar.xz"
```

Use `linux-arm64` instead of `linux-x64` if step 0 printed `aarch64`. Stop if the
checksum line does not say `OK`.

## Step 3 — service user and directories

```bash
sudo useradd --system --home /srv/forexlab-access --shell /usr/sbin/nologin forexlab-access
sudo install -d -o forexlab-access -g forexlab-access -m 755 /srv/forexlab-access /srv/forexlab-access/releases
sudo install -d -o root -g root -m 755 /etc/forexlab-access
```

## Step 4 — environment file (no secrets)

```bash
sudo tee /etc/forexlab-access/access.env > /dev/null <<'EOF'
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_REBATE_URL=https://rebate.ea-forexlab.com
NEXT_PUBLIC_MAIN_SITE_URL=https://ea-forexlab.com
ACCESS_CATALOG_API_URL=https://rebate.ea-forexlab.com/api/access/catalog
ACCESS_CATALOG_REVALIDATE_SECONDS=60
EOF
sudo chmod 644 /etc/forexlab-access/access.env
cat /etc/forexlab-access/access.env
```

`NEXT_PUBLIC_ACCESS_ONBOARDING` and `NEXT_PUBLIC_VENDOR_LOGIN_URL` are deliberately
absent. Confirm no line contains `127.0.0.1`, `localhost` or `8783`.

## Step 5 — fetch and build the reviewed commit

Set `COMMIT` to the reviewed, merged `origin/main` commit (full 40-character SHA).

```bash
COMMIT=<reviewed-origin-main-sha>
R=/srv/forexlab-access/releases/$COMMIT
sudo -u forexlab-access git clone --quiet https://github.com/davincifxgroup/finsage-fintech-landing.git "$R"
sudo -u forexlab-access git -C "$R" checkout --quiet --detach "$COMMIT"
sudo -u forexlab-access git -C "$R" rev-parse HEAD
sudo -u forexlab-access git -C "$R" status --short
```

Stop if `rev-parse` differs from `COMMIT` or `status` prints anything.

```bash
sudo -u forexlab-access env -i HOME=/srv/forexlab-access PATH=/opt/node-v22/bin:/usr/bin:/bin COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  bash -c 'command -v node && node --version'
```

Expect `/opt/node-v22/bin/node` and the version installed in step 2; stop otherwise.
This is the same `PATH` the service uses (step 6).

```bash
sudo -u forexlab-access env -i HOME=/srv/forexlab-access PATH=/opt/node-v22/bin:/usr/bin:/bin COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  bash -c 'set -a; . /etc/forexlab-access/access.env; set +a; cd "'"$R"'" && corepack pnpm install --frozen-lockfile && corepack pnpm lint && corepack pnpm build'
```

 The build must end with the route table; the two lines
`[access-catalog] advisor list returned HTTP 404` are expected while production Rebate
has no catalog API. Then confirm the build carries production addresses only:

```bash
sudo grep -rlE '127\.0\.0\.1:(8783|3382)|localhost:(8783|3382)|example\.test|fictional' "$R/.next" || echo "clean"
sudo grep -o '<meta name="robots"[^>]*>' "$R/.next/server/app/index.html"
```

Expect `clean` and `noindex, nofollow, noarchive`.

## Step 6 — systemd service

```bash
sudo tee /etc/systemd/system/forexlab-access.service > /dev/null <<'EOF'
[Unit]
Description=ForexLAB Access website (Next.js, presentation-only)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=forexlab-access
Group=forexlab-access
WorkingDirectory=/srv/forexlab-access/current
EnvironmentFile=/etc/forexlab-access/access.env
Environment=PATH=/opt/node-v22/bin:/usr/bin:/bin
ExecStart=/opt/node-v22/bin/node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/srv/forexlab-access/releases
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
LockPersonality=true

[Install]
WantedBy=multi-user.target
EOF
sudo ln -sfn "$R" /srv/forexlab-access/current
sudo systemctl daemon-reload
sudo systemctl enable --now forexlab-access
systemctl is-active forexlab-access
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3100/
curl -s http://127.0.0.1:3100/ | grep -o '<meta name="robots"[^>]*>'
```

Adjust `3100` if step 0d shows it in use; the Node path stays `/opt/node-v22` (step 2). Expect `active`, `200`
and the noindex meta. The public site still shows the placeholder at this point.

## Step 7 — switch only the Access Nginx site

Edit `/etc/nginx/sites-available/eaforexlab-access` in place. Keep its `listen`,
`server_name`, certificate lines and HTTP→HTTPS redirect exactly as they are. Replace
only the placeholder response (the `return 503 ...;`) with a proxy to the local service.

Response headers stay **at server level only**. On Nginx 1.24 any `add_header` inside a
`location` disables inheritance of *all* server-level `add_header` lines for that
location (`add_header_inherit` exists only from 1.29.3 and is not available here). So
the proxied `location` must contain **no** `add_header`. The server block keeps
`X-Robots-Tag` and the headers the placeholder already sets (for example
`X-Content-Type-Options`); a `Cache-Control` that belongs to the 503 placeholder is
reviewed against the real file rather than copied blindly, because it would also apply
to the site's pages and assets.

```nginx
    # server level (existing lines kept; X-Robots-Tag must be present here)
    add_header X-Robots-Tag "noindex, nofollow, noarchive" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_hide_header X-Powered-By;
        # no add_header here: it would drop the server-level headers above
    }
```

The exact diff is prepared from the real file after step 0. Then:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Do not reload if `nginx -t` reports anything other than success. The Rebate site file
is not opened or edited.

## Step 8 — verify

```bash
curl -sI https://access.ea-forexlab.com/ | grep -iE '^(HTTP|x-robots-tag|x-content-type-options|x-powered-by)'
curl -sI https://access.ea-forexlab.com/advisors | grep -iE '^(HTTP|x-robots-tag)'
curl -s https://access.ea-forexlab.com/ | grep -o '<meta name="robots"[^>]*>'
curl -s https://access.ea-forexlab.com/advisors | grep -c 'Coming soon'
curl -s -o /dev/null -w '%{http_code}\n' https://access.ea-forexlab.com/advisors/does-not-exist
curl -s -o /dev/null -w '%{http_code}\n' https://access.ea-forexlab.com/robots.txt
curl -s -o /dev/null -w '%{http_code}\n' https://rebate.ea-forexlab.com/login
curl -s -o /dev/null -w '%{http_code}\n' http://access.ea-forexlab.com/
systemctl is-active forexlab-access eaforexlab-rebate nginx
```

Expect: `200` with `X-Robots-Tag: noindex, nofollow, noarchive` for both pages, the
other server-level headers present on the proxied responses and no `X-Powered-By`; the
noindex meta; at least one "Coming soon"; `404` for the unknown advisor and for
`robots.txt` (no Disallow file); `200` for Rebate login; `301` for plain HTTP; all
three services `active`. Then open the site in a browser at desktop and phone width.

## Rollback (any failed check)

Restore the placeholder first and confirm it is live; touch the Access service only
after that. Run one command at a time.

```bash
sudo cp -a /root/forexlab-access-backups/eaforexlab-access.placeholder-<timestamp> /etc/nginx/sites-available/eaforexlab-access
sudo nginx -t
```

Continue only if `nginx -t` reports `syntax is ok` and `test is successful`.

```bash
sudo systemctl reload nginx && echo "reload ok"
curl -s -o /dev/null -w '%{http_code}\n' https://access.ea-forexlab.com/
curl -s https://access.ea-forexlab.com/ | head -1
```

Continue only if the reload printed `reload ok`, the status is `503` and the body is
the placeholder text (`ForexLAB Access is being prepared.`). Then, and only then:

```bash
sudo systemctl disable --now forexlab-access
systemctl is-active forexlab-access eaforexlab-rebate nginx
```

If any check in this section fails (the copy, `nginx -t`, the reload or the 503),
**stop**: do not stop or disable `forexlab-access`, so the public site keeps a working
backend, and report the output. Rebate is never touched by this procedure. Releases,
the unit and Node can stay installed for the next attempt.

## Later updates

A new reviewed commit is built into a new `releases/<commit>` directory (step 5), then
`current` is re-pointed and the service restarted
(`sudo ln -sfn "$R" /srv/forexlab-access/current && sudo systemctl restart forexlab-access`).
Opening onboarding requires the Rebate backend with the Access code deployed first,
then a build with `NEXT_PUBLIC_ACCESS_ONBOARDING=open` — a separate, explicit decision.
