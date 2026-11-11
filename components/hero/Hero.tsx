import "@fontsource/lato/400.css";
import "@fontsource/lato/900.css";

import type { CSSProperties } from "react";

import { asset, links, sectionNav } from "@/lib/site";

// Customer-facing facts for the top strip. No allocation figures, prices or returns.
const stripFacts = [
  "No upfront license payment",
  "MT4 / MT5 Expert Advisors",
  "Independently evaluated",
  "Cashback once the license is covered",
];

/* ============================================================
   FITTED BACKGROUND MODEL

   Reference design space:
   1024 × 657

   IMPORTANT:
   This background is rendered inside a proportional design
   frame. The frame itself uses COVER behaviour.

   Therefore the ellipses never stretch independently in X/Y.
============================================================ */
const heroBackgroundStyle: CSSProperties = {
  backgroundColor: "#ffffff",

  backgroundImage: `
    radial-gradient(
      ellipse 31.905% 37.902%
      at 23.122% 23.428%,
      rgba(255,255,255,0.5001) 0%,
      rgba(255,255,255,0.4411) 16.7%,
      rgba(255,255,255,0.3036) 33.3%,
      rgba(255,255,255,0.1623) 50%,
      rgba(255,255,255,0.0675) 66.7%,
      rgba(255,255,255,0.0220) 83.3%,
      rgba(255,255,255,0) 100%
    ),

    radial-gradient(
      ellipse 40.198% 50.201%
      at 57.714% 22.303%,
      rgba(0,0,226,0.2483) 0%,
      rgba(0,0,226,0.2190) 16.7%,
      rgba(0,0,226,0.1508) 33.3%,
      rgba(0,0,226,0.0806) 50%,
      rgba(0,0,226,0.0335) 66.7%,
      rgba(0,0,226,0.0109) 83.3%,
      rgba(0,0,226,0) 100%
    ),

    radial-gradient(
      ellipse 63.969% 61.001%
      at 73.822% -0.298%,
      rgba(255,210,233,0.9800) 0%,
      rgba(255,210,233,0.8644) 16.7%,
      rgba(255,210,233,0.5950) 33.3%,
      rgba(255,210,233,0.3182) 50%,
      rgba(255,210,233,0.1324) 66.7%,
      rgba(255,210,233,0.0432) 83.3%,
      rgba(255,210,233,0) 100%
    ),

    radial-gradient(
      ellipse 83.621% 59.252%
      at 84.128% 18.134%,
      rgba(0,189,244,0.9040) 0%,
      rgba(0,189,244,0.7974) 16.7%,
      rgba(0,189,244,0.5488) 33.3%,
      rgba(0,189,244,0.2935) 50%,
      rgba(0,189,244,0.1221) 66.7%,
      rgba(0,189,244,0.0398) 83.3%,
      rgba(0,189,244,0) 100%
    ),

    radial-gradient(
      ellipse 38.215% 39.413%
      at 48.934% 2.424%,
      rgba(0,115,253,0.9744) 0%,
      rgba(0,115,253,0.8594) 16.7%,
      rgba(0,115,253,0.5916) 33.3%,
      rgba(0,115,253,0.3163) 50%,
      rgba(0,115,253,0.1316) 66.7%,
      rgba(0,115,253,0.0429) 83.3%,
      rgba(0,115,253,0) 100%
    )
  `,

  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 100%",
};

export function Hero() {
  return (
    <section
      id="top"
      data-px="hero"
      className="hero relative min-h-screen overflow-hidden [--strip-h:52px] md:[--strip-h:40px]"
    >
      {/* =====================================================
          1. MARKET TICKER
      ====================================================== */}
      <div
        data-px="hero.ticker"
        className="hero-ticker relative z-30 flex h-[var(--strip-h)] w-full items-center justify-center overflow-hidden bg-black px-4 text-white"
      >
        {/* Readable facts with separators; wraps to two lines on phones. */}
        <ul className="hero-ticker-track flex flex-wrap items-center justify-center gap-x-5 gap-y-[3px] text-[12px] leading-[16px] md:gap-x-0 md:text-[13px] md:leading-none">
          {stripFacts.map((fact, index) => (
            <li
              key={fact}
              className={`hero-ticker-item flex items-center whitespace-nowrap ${index === 3 ? "hidden lg:flex" : ""}`}
            >
              {index > 0 ? (
                <span aria-hidden="true" className="mx-6 hidden h-[4px] w-[4px] rounded-full bg-white/45 md:block" />
              ) : null}
              {fact}
            </li>
          ))}
        </ul>
      </div>

      {/* =====================================================
          2. HERO BODY

          Reference design space:
          1024 × 657

          hero-body itself is only the viewport canvas.

          Background and content use DIFFERENT scale modes:

          background = COVER
          content    = CONTAIN
      ====================================================== */}
      <div
        data-px="hero.body"
        className="
          hero-body
          relative
          isolate
          h-[calc(100svh-var(--strip-h))]
          min-h-[620px]
          w-full
          overflow-hidden
          bg-white
          [container-type:size]
          [font-family:Lato,sans-serif]
        "
      >
        {/* ===================================================
            RESPONSIVE BACKGROUND DESIGN FRAME

            COVER formula:

            width =
              max(
                viewport width,
                hero height × 1024 / 657
              )

            This means:

            1024×657
            → exact 1024×657

            ultrawide
            → width follows viewport
            → height grows proportionally
            → excess bottom is cropped

            tall viewport
            → height constraint wins
            → excess horizontal content is cropped

            NO distortion.
            NO bitmap holes.
            NO ghost UI.
        ==================================================== */}
        <div
          data-px="hero.background"
          aria-hidden="true"
          style={heroBackgroundStyle}
          className="
            hero-background-model
            pointer-events-none
            absolute
            left-1/2
            top-0
            z-0
            aspect-[1024/657]
            w-[max(100vw,calc((100svh-var(--strip-h))*1.5586))]
            -translate-x-1/2
          "
        />

        {/* ===================================================
            3. HEADER

            Header is NOT inside the content design frame.

            Horizontal anchors are viewport-relative.

            --u uses CONTAIN scaling:

            min(
              viewportWidth / 1024,
              heroHeight / 657
            )
        ==================================================== */}
        <header
          data-px="hero.header"
          style={
            {
              "--u": "min(0.09765625cqw,0.152207cqh)",
            } as CSSProperties
          }
          className="
            hero-header
            absolute
            left-5
            right-5
            top-[max(calc(var(--u)*24),14px)]
            md:left-[9.5vw]
            md:right-[9.5vw]
            z-20
            flex
            items-start
            justify-between
          "
        >
          {/* =================================================
              BRAND
          ================================================== */}
          <a data-px="hero.brand" href="#top" className="hero-brand flex items-center">
            {/* Approved V2 compact horizontal logo (light-background variant). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/brand/forexlab-access-header-light.svg")}
              alt="ForexLAB Access"
              width={332}
              height={64}
              className="
                hero-brand-logo
                block
                h-[max(calc(var(--u)*58),44px)]
                w-auto
                -ml-[calc(var(--u)*10)]
                -mt-[calc(var(--u)*12)]
              "
            />
          </a>

          {/* =================================================
              NAVIGATION
          ================================================== */}
          <nav
            data-px="hero.nav"
            className="
              hero-navigation
              relative
              right-[calc(var(--u)*2)]
              top-[calc(var(--u)*-5)]
              flex
              flex-col
              items-end
              text-[max(calc(var(--u)*11),12px)]
              font-normal
              leading-[max(calc(var(--u)*21.2),21px)]
            "
            aria-label="Main"
          >
            {sectionNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                data-px="hero.nav.item"
                className="
                  hero-navigation-item
                  whitespace-nowrap
                  underline
                  decoration-[calc(var(--u)*1)]
                  underline-offset-[calc(var(--u)*1)]
                "
              >
                {item.label}
              </a>
            ))}

            {/* Two separate entries into the same Rebate authentication. */}
            <div className="mt-[max(calc(var(--u)*10),8px)] flex flex-col items-end gap-[max(calc(var(--u)*6),6px)]">
              <a
                href={links.login}
                data-px="hero.nav.login"
                className="
                  inline-flex
                  h-[max(calc(var(--u)*24),30px)]
                  items-center
                  whitespace-nowrap
                  rounded-full
                  bg-black
                  px-[max(calc(var(--u)*12),14px)]
                  font-bold
                  leading-none
                  text-white
                "
              >
                Client Log In
              </a>
              <a
                href={links.vendorLogin}
                data-px="hero.nav.vendor"
                className="
                  inline-flex
                  h-[max(calc(var(--u)*24),30px)]
                  items-center
                  whitespace-nowrap
                  rounded-full
                  border
                  border-black
                  bg-white/60
                  px-[max(calc(var(--u)*12),14px)]
                  font-bold
                  leading-none
                  text-black
                "
              >
                Vendor Login
              </a>
            </div>
          </nav>
        </header>

        {/* ===================================================
            4. CENTRAL CONTENT DESIGN FRAME

            CONTAIN formula:

            width =
              min(
                viewport width,
                hero height × 1024 / 657
              )

            Everything inside scales with one coefficient.
        ==================================================== */}
        <div
          data-px="hero.stage"
          className="
            hero-stage
            absolute
            left-1/2
            top-1/2
            z-10
            aspect-[1024/657]
            w-[min(100vw,calc((100svh-var(--strip-h))*1.5586))]
            -translate-x-1/2
            -translate-y-1/2
            [container-type:inline-size]

            max-md:top-[calc(50%+64px)]
            max-md:flex
            max-md:aspect-auto
            max-md:w-[calc(100vw-40px)]
            max-md:flex-col
            max-md:items-center
            max-md:gap-5
          "
        >
          {/* =================================================
              ARTWORK
              The artwork is its own container so the circle offsets
              scale with it (identical on desktop; reused on mobile).
          ================================================== */}
          <div
            data-px="hero.artwork"
            className="
              hero-artwork
              absolute
              left-1/2
              top-[10.9375cqw]
              h-[7.128906cqw]
              w-[12.988281cqw]
              -translate-x-1/2
              [container-type:inline-size]

              max-md:static
              max-md:h-[18.66cqw]
              max-md:w-[34cqw]
              max-md:translate-x-0
            "
          >
            <div className="hero-artwork-stage relative h-full w-full">
              <div
                className="
                  hero-artwork-circle
                  absolute
                  left-0
                  top-1/2
                  aspect-square
                  h-full
                  -translate-y-1/2
                  rounded-full
                  border
                  border-black
                "
              />

              <div
                className="
                  hero-artwork-circle
                  absolute
                  left-[11.278195cqw]
                  top-1/2
                  aspect-square
                  h-full
                  -translate-y-1/2
                  rounded-full
                  border
                  border-black
                "
              />

              <div
                className="
                  hero-artwork-circle
                  absolute
                  left-[22.556391cqw]
                  top-1/2
                  aspect-square
                  h-full
                  -translate-y-1/2
                  rounded-full
                  border
                  border-black
                "
              />

              <div
                className="
                  hero-artwork-circle
                  absolute
                  left-[33.834586cqw]
                  top-1/2
                  aspect-square
                  h-full
                  -translate-y-1/2
                  rounded-full
                  border
                  border-black
                "
              />

              <div
                className="
                  hero-artwork-circle
                  absolute
                  left-[45.112782cqw]
                  top-1/2
                  aspect-square
                  h-full
                  -translate-y-1/2
                  rounded-full
                  border
                  border-black
                "
              />
            </div>
          </div>

          {/* =================================================
              EYEBROW
          ================================================== */}
          <p
            data-px="hero.eyebrow"
            className="
              hero-eyebrow
              absolute
              left-[calc(50%_-_0.09765625cqw)]
              top-[22.460938cqw]
              -translate-x-1/2
              whitespace-nowrap
              text-center
              text-[1.074219cqw]
              font-normal
              leading-[1.367188cqw]
              tracking-[0.001953125cqw]

              max-md:static
              max-md:max-w-[300px]
              max-md:translate-x-0
              max-md:whitespace-normal
              max-md:text-[13px]
              max-md:leading-[19px]
            "
          >
            Independently evaluated Expert Advisors for MT4 and MT5 traders.
          </p>

          {/* =================================================
              TITLE
          ================================================== */}
          <h1
            data-px="hero.title"
            className="
              hero-title
              absolute
              left-1/2
              top-[25.292969cqw]
              -translate-x-1/2
              text-center
              text-[5.2cqw]
              font-black
              leading-[5.6cqw]
              tracking-normal

              max-md:static
              max-md:translate-x-0
              max-md:text-[34px]
              max-md:leading-[38px]
            "
          >
            <span
              className="block whitespace-nowrap max-md:whitespace-normal max-md:text-balance"
              style={{
                transform:
                  "translate(0.09765625cqw, 0.1171875cqw) scaleX(0.985) scaleY(1.16)",
                transformOrigin: "center center",
              }}
            >
              Expert-Tested Trading Bots.
            </span>

            <span
              className="block whitespace-nowrap max-md:mt-1 max-md:whitespace-normal max-md:text-balance"
              style={{
                transform:
                  "translate(-0.244140625cqw, 0.1171875cqw) scaleX(0.985) scaleY(1.16)",
                transformOrigin: "center center",
              }}
            >
              Without the Upfront Price.
            </span>
          </h1>

          {/* =================================================
              PROMPT
          ================================================== */}
          <div
            data-px="hero.prompt"
            className="
              hero-prompt
              absolute
              left-1/2
              top-[41.79082cqw]
              flex
              w-[39.746094cqw]
              -translate-x-1/2
              flex-col
              gap-[0.195313cqw]

              max-md:static
              max-md:w-full
              max-md:translate-x-0
              max-md:gap-[3px]
            "
          >
            {/* Same framed panel as the original prompt box; static copy instead of an input. */}
            <div
              data-px="hero.prompt.input"
              className="
                hero-prompt-input
                h-[7.617188cqw]
                w-full
                rounded-[0.78125cqw]
                border
                border-black
                bg-transparent
                px-[1.464844cqw]
                py-[1.269531cqw]
                text-[0.976563cqw]
                font-normal
                leading-[1.367188cqw]

                max-md:h-auto
                max-md:rounded-[10px]
                max-md:px-4
                max-md:py-[14px]
                max-md:text-[13px]
                max-md:leading-[19px]
              "
            >
              Eligible broker partner commissions from your trading cover the agreed
              license price over time, so there is no upfront payment. Access requires a
              verified broker account and license approval.{" "}
              <a href="#how-it-works" className="whitespace-nowrap underline underline-offset-2">
                How It Works →
              </a>
            </div>

            <a
              href="#advisors"
              data-px="hero.prompt.submit"
              className="
                hero-prompt-submit
                flex
                h-[3.125cqw]
                w-full
                items-center
                justify-center
                rounded-[0.878906cqw]
                bg-black
                text-[0.976563cqw]
                font-normal
                leading-none
                text-white

                max-md:h-[46px]
                max-md:rounded-[11px]
                max-md:text-[14px]
              "
            >
              Explore Advisors →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
