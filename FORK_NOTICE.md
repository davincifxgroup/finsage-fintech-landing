# Fork notice: ForexLAB Access adaptation

This repository is a fork of **[meligavincent/finsage-fintech-landing](https://github.com/meligavincent/finsage-fintech-landing)**
by MELIGA Vincent. The original README, design and code authorship are preserved;
see [README.md](README.md).

- **Upstream commit:** `5b11b549e32ca8a267117ae4d0340fa4806d61a0` (2026-10-12)
- **Adaptation branch:** `forexlab-access`, kept local and unpublished for internal review

## Licensing status: unresolved

The upstream repository has **no license**. There is no LICENSE file, GitHub reports
no license, `package.json` is `"private": true`, and the README describes it as a
portfolio prototype. With no license, normal copyright applies: public availability
and GitHub forking do not grant permission to modify, redistribute, deploy or use
this code, its styles, animations or its background image commercially.

**Do not deploy, publish or merge this adaptation into any ForexLAB product until
written permission (or a license) has been obtained from the upstream author.**

Third-party dependencies keep their own licenses (Next.js, React, Tailwind CSS,
GSAP, Lato via `@fontsource/lato`); GSAP's no-charge license terms should be
confirmed for commercial use.

## What was changed for ForexLAB Access

- Branding: approved ForexLAB Access V2 logo and mark (`public/brand/`) replace the
  FinSage mark and wordmarks; favicon and metadata (`noindex`).
- Copy, navigation and section content replaced with ForexLAB Access product
  content. No advisor names, prices, performance figures or testimonials are invented.
- Brokers: `content/brokers.json`, exported from active Rebate `Broker` records
  (a snapshot from a disposable local database, to be wired to Rebate at integration).
- Links: authentication and accounts stay in ForexLAB Rebate (`lib/site.ts`,
  `NEXT_PUBLIC_REBATE_URL`, `NEXT_PUBLIC_MAIN_SITE_URL`).
- Layout, typography, gradients, spacing and GSAP motion are kept from upstream.
  Deliberate deviations:
  - **Hero, mobile:** a readable stacked layout below 768px. Upstream scales the
    desktop frame down, which makes its text unreadably small.
  - **Ticker:** fewer columns on narrow screens so the labels don't overlap.
  - **Nav text:** a minimum size on mobile.
  - **Orbital artwork:** circle offsets re-expressed against their own container,
    with identical rendering on desktop.
  - **Line breaks:** desktop-only breaks now keep word spacing on mobile.
