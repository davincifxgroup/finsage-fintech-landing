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
  FinSage mark and wordmarks in the header, footer and opening loader animation;
  favicon and metadata (`noindex`); chapter labels renamed for Access.
- Copy, navigation and section content replaced with ForexLAB Access product
  content. No advisor names, prices, performance figures or testimonials are invented.
  No revenue split or allocation percentages are shown publicly; the benefit is
  explained in plain English.
- How It Works shows five customer-facing steps inside the original terminal frame.
  Tab-looking chips are non-interactive labels (a list, no hover affordance).
- Separate "Client Log In" and "Vendor Login" entries. Both use the existing Rebate
  authentication; Vendor Login points at the Rebate login page until a vendor area
  exists (planned: `/vendor/` on the Rebate host; override NEXT_PUBLIC_VENDOR_LOGIN_URL).
- Brokers: `content/brokers.json`, exported from active Rebate `Broker` records with
  `content/export_active_brokers.py` (refuses any roster other than the approved six:
  IC Markets, Tickmill, RoboForex, IC Trading, Fusion Markets, FP Markets). Snapshot
  taken from a disposable Rebate database prepared with migrate + seed_demo.
- Links: authentication and accounts stay in ForexLAB Rebate (`lib/site.ts`,
  `NEXT_PUBLIC_REBATE_URL`, `NEXT_PUBLIC_MAIN_SITE_URL`).
- Layout, typography, gradients, spacing and GSAP motion are kept from upstream.
  Deliberate deviations:
  - **Hero, mobile:** a readable stacked layout below 768px. Upstream scales the
    desktop frame down, which makes its text unreadably small.
  - **Nav text:** a minimum size on mobile.
  - **Orbital artwork:** circle offsets re-expressed against their own container,
    with identical rendering on desktop.
  - **Line breaks:** desktop-only breaks now keep word spacing on mobile.
  - **Top strip:** customer-facing facts at a readable size, wrapping on phones.
  - **In-page navigation** (`setupSectionNavigation` in
    `components/motion/LandingMotionController.tsx`): clicks on in-page links,
    direct hash URLs and back/forward land at the scroll position where the
    destination is fully revealed (the end of a pinned reveal timeline, or the
    section top), and finish any scrub smoothing at once. Normal scrolling keeps
    every original animation. A direct hash URL skips the opening intro.
  - **FAQ rail:** the horizontal travel starts once every card has appeared (0.44
    instead of 0.38 of the pinned timeline), giving a clean landing point.
  - **Risk note:** the How It Works note is dimmed only while motion runs, so it
    stays readable with reduced motion.
