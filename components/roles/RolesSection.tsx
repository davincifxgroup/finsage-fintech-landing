import type { AdvisorCard } from "@/lib/catalog";
import { formatPrice } from "@/lib/catalog";
import { asset, links } from "@/lib/site";
import { OnboardingAction } from "@/components/shared/OnboardingAction";

/** Advisors shown directly in the homepage panel; the full list lives at /advisors. */
const PANEL_LIMIT = 3;

// The customer benefit in plain English. No allocation figures are published.
const roles = [
  {
    title: "No Upfront License Fees",
    description: (
      <>
        Access professionally evaluated
        <br />
        Expert Advisors without purchasing
        <br />
        a license.
      </>
    ),
    icon: "license",
  },
  {
    title: "Commission-Funded Access",
    description: (
      <>
        Broker partner commissions fund
        <br />
        the service. No additional license
        <br />
        payments or cashback.
      </>
    ),
    icon: "coins",
  },
  {
    title: "Access While Eligible",
    description: (
      <>
        Keep using your Expert Advisor as
        <br />
        long as your broker account meets
        <br />
        the program requirements.
      </>
    ),
    icon: "wallet",
  },
];

export function RolesSection({ advisors = [] }: { advisors?: AdvisorCard[] }) {
  const hasAdvisors = advisors.length > 0;
  return (
    <section
      id="mechanism"
      data-px="roles"
      className="
        roles relative isolate w-full overflow-hidden bg-white
        [font-family:Lato,Arial,sans-serif]

        min-h-screen
        lg:min-h-0
      "
    >
      {/* BACKGROUND */}
      <div
        data-px="roles.background"
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 z-0
          bg-white

          before:absolute
          before:inset-x-0
          before:top-0
          before:h-[32%]
          before:bg-[radial-gradient(ellipse_at_8%_0%,rgba(215,229,247,0.48)_0%,rgba(235,240,248,0.20)_35%,transparent_68%),radial-gradient(ellipse_at_88%_2%,rgba(255,223,236,0.27)_0%,transparent_60%)]
          before:content-['']
        "
      />

      {/* DESIGN FRAME */}
      <div
        className="
          relative z-10 mx-auto w-full
          px-5 py-14
          sm:px-8

          lg:relative
          lg:p-0
          lg:[container-type:inline-size]
          lg:[--u:0.083472454cqw]
        "
      >
        {/* EYEBROW */}
        <div
          data-px="roles.label"
          className="
            flex items-center justify-center gap-2

            lg:absolute
            lg:left-1/2
            lg:top-[calc(var(--u)*64)]
            lg:-translate-x-1/2
            lg:gap-[calc(var(--u)*8)]
          "
        >
          <span
            aria-hidden="true"
            className="
              h-[7px] w-[7px] rounded-full bg-black

              lg:h-[calc(var(--u)*7)]
              lg:w-[calc(var(--u)*7)]
            "
          />

          <span
            className="
              text-[13px] font-medium leading-none text-black

              lg:text-[calc(var(--u)*13)]
            "
          >
            Why No Upfront Price
          </span>
        </div>

        {/* HEADER */}
        <div
          data-px="roles.header"
          className="
            mt-14 flex flex-col items-center

            lg:absolute
            lg:left-1/2
            lg:top-[calc(var(--u)*128)]
            lg:mt-0
            lg:-translate-x-1/2
          "
        >
          <h2
            data-px="roles.title"
            className="
              text-center text-[38px] font-black
              leading-[1.02] tracking-[-0.045em]
              text-black

              sm:text-[48px]

              lg:whitespace-nowrap
              lg:text-[calc(var(--u)*47)]
              lg:leading-[calc(var(--u)*52)]
            "
          >
            How Access Is Funded.
          </h2>

          <p
            data-px="roles.subtitle"
            className="
              mt-6 max-w-[470px]
              text-center text-[13px]
              leading-[19px] text-black

              lg:mt-[calc(var(--u)*20)]
              lg:w-[calc(var(--u)*430)]
              lg:max-w-none
              lg:text-[calc(var(--u)*13)]
              lg:leading-[calc(var(--u)*19)]
            "
          >
            Broker partner commissions fund Access, so you can use{" "}
            <br className="hidden lg:block" />
            evaluated EAs without purchasing a license.
            <span
              className="
                mt-2 block text-[12px] leading-[18px] text-[#555]

                lg:mt-[calc(var(--u)*8)]
                lg:text-[calc(var(--u)*12)]
                lg:leading-[calc(var(--u)*18)]
              "
            >
              Trading involves risk. Returns are never guaranteed.
            </span>
          </p>
        </div>

        {/* ROLE CARDS */}
        <div
          data-px="roles.cards"
          className="
            mt-16 grid grid-cols-1 gap-0

            lg:absolute
            lg:left-[calc(var(--u)*118)]
            lg:top-[calc(var(--u)*323)]
            lg:mt-0
            lg:h-[calc(var(--u)*99)]
            lg:w-[calc(var(--u)*966)]
            lg:grid-cols-3
          "
        >
          {roles.map((role, index) => (
            <article
              key={role.title}
              data-px={`roles.card.${index + 1}`}
              className="
                relative flex
                border-t border-black/50
                py-7

                first:border-t-0

                lg:h-full
                lg:border-l
                lg:border-t-0
                lg:py-0

                lg:last:border-r
              "
            >
              <div
                className="
                  flex w-full items-start gap-4

                  lg:absolute
                  lg:left-[calc(var(--u)*25)]
                  lg:top-0
                  lg:gap-[calc(var(--u)*14)]
                "
              >
                <div
                  data-px={`roles.card.${index + 1}.icon`}
                  className="
                    flex h-[46px] w-[46px]
                    shrink-0 items-center justify-center
                    rounded-[12px]
                    border border-[#c9d7f8]
                    bg-gradient-to-br from-[#f1f5ff] to-[#e3ebfd]
                    text-[#1d4fd7]

                    lg:h-[max(calc(var(--u)*46),40px)]
                    lg:w-[max(calc(var(--u)*46),40px)]
                    lg:rounded-[max(calc(var(--u)*12),10px)]
                  "
                >
                  <RoleIcon type={role.icon} />
                </div>

                <div
                  data-px={`roles.card.${index + 1}.copy`}
                  className="min-w-0"
                >
                  <h3
                    data-px={`roles.card.${index + 1}.title`}
                    className="
                      text-[17px] font-bold
                      leading-[20px] text-black

                      lg:text-[calc(var(--u)*17)]
                      lg:leading-[calc(var(--u)*20)]
                    "
                  >
                    {role.title}
                  </h3>

                  <p
                    data-px={`roles.card.${index + 1}.description`}
                    className="
                      mt-[14px]
                      text-[13px]
                      leading-[19px]
                      text-[#666]

                      lg:mt-[calc(var(--u)*14)]
                      lg:text-[calc(var(--u)*13)]
                      lg:leading-[calc(var(--u)*19)]
                    "
                  >
                    {role.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* INVESTGPT */}
        <div
          id="advisors"
          data-px="roles.investgpt"
          className="
            mt-20 grid overflow-hidden
            grid-cols-1 bg-black

            lg:mb-[calc(var(--u)*44)]
            lg:ml-[calc(var(--u)*117)]
            lg:mt-[calc(var(--u)*583)]
            lg:min-h-[calc(var(--u)*460)]
            lg:w-[calc(var(--u)*969)]
            lg:grid-cols-[calc(var(--u)*417)_calc(var(--u)*552)]
          "
        >
          {/* LEFT VISUAL */}
          <div
            data-px="roles.investgpt.visual"
            className="
              relative aspect-square
              overflow-hidden bg-black

              lg:aspect-auto
              lg:min-h-[calc(var(--u)*460)]
              lg:w-[calc(var(--u)*417)]
            "
          >
            {/* AMBIENT GLOW */}
            <div
              data-motion="investgpt-glow"
              aria-hidden="true"
              className="
                absolute left-1/2 top-1/2
                aspect-square w-[72%]
                -translate-x-1/2 -translate-y-1/2
                rounded-full
                bg-[radial-gradient(circle_at_45%_50%,rgba(237,155,210,0.65)_0%,rgba(88,137,255,0.55)_32%,rgba(24,53,119,0.25)_50%,transparent_71%)]
                blur-[8px]
              "
            />

            {/* OUTER RING */}
            <div
              aria-hidden="true"
              className="
                absolute left-1/2 top-1/2
                aspect-square w-[58%]
                -translate-x-1/2 -translate-y-1/2
                rounded-full
                border border-white/15
              "
            />

            {/* INNER RING */}
            <div
              aria-hidden="true"
              className="
                absolute left-1/2 top-1/2
                aspect-square w-[40.5%]
                -translate-x-1/2 -translate-y-1/2
                rounded-full
                border border-white/35
              "
            />

            {/* CENTER MARK */}
            <div
              data-px="roles.investgpt.mark"
              className="
                absolute left-1/2 top-1/2
                flex h-[70px] w-[70px]
                -translate-x-1/2 -translate-y-1/2
                items-center justify-center
                rounded-full bg-white

                lg:h-[calc(var(--u)*70)]
                lg:w-[calc(var(--u)*70)]
              "
            >
              <div
                data-motion="investgpt-symbol"
                className="
                  relative h-[34px] w-[34px]

                  lg:h-[calc(var(--u)*34)]
                  lg:w-[calc(var(--u)*34)]
                "
              >
                {/* Approved ForexLAB Access mark replaces the original symbol. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset("/brand/forexlab-access-mark-light.svg")}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </div>

          {/* BLUE PANEL */}
          <div
            data-px="roles.investgpt.panel"
            className="
              relative
              bg-[#4e82f3]
              px-7 py-12
              text-white

              lg:min-h-[calc(var(--u)*460)]
              lg:w-[calc(var(--u)*552)]
              lg:px-0
              lg:py-0
            "
          >
            {/* DECORATION (clipped on its own; the content below is never clipped) */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* LIGHT FIELD */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute inset-0
                bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.10),transparent_35%),linear-gradient(115deg,rgba(255,255,255,0.03),rgba(22,93,238,0.08))]
              "
            />

            {/* DIAGONAL LINE 1 */}
            <div
              aria-hidden="true"
              className="
                absolute -top-[8%] right-[25%]
                h-[120%] w-px
                rotate-[7deg]
                bg-black/80
              "
            />

            {/* DIAGONAL LINE 2 */}
            <div
              aria-hidden="true"
              className="
                absolute -top-[8%] right-[15%]
                h-[120%] w-px
                rotate-[7deg]
                bg-black/80
              "
            />
            </div>

            {/* CONTENT */}
            <div
              data-px="roles.investgpt.content"
              className="
                relative z-10

                lg:pb-[calc(var(--u)*52)]
                lg:pl-[calc(var(--u)*52)]
                lg:pr-[calc(var(--u)*40)]
                lg:pt-[calc(var(--u)*64)]
              "
            >
              <div
                data-px="roles.investgpt.label"
                className="
                  flex items-center gap-2
                  text-[13px] leading-none

                  lg:gap-[calc(var(--u)*8)]
                  lg:text-[calc(var(--u)*13)]
                "
              >
                <span
                  className="
                    h-[7px] w-[7px]
                    rounded-full bg-white

                    lg:h-[calc(var(--u)*7)]
                    lg:w-[calc(var(--u)*7)]
                  "
                />

                <span>Advisor Catalog</span>
              </div>

              <h3
                data-px="roles.investgpt.title"
                className="
                  mt-9 max-w-[350px]
                  text-[30px] font-bold
                  leading-[1.05]
                  tracking-[-0.025em]

                  lg:mt-[calc(var(--u)*36)]
                  lg:w-[calc(var(--u)*330)]
                  lg:max-w-none
                  lg:text-[calc(var(--u)*27)]
                  lg:leading-[calc(var(--u)*30)]
                "
              >
                Independently Selected
                <br />
                Expert Advisors.
              </h3>

              {hasAdvisors ? (
                <>
                <ul
                  data-px="roles.investgpt.advisors"
                  aria-label="Published advisors"
                  className="
                    mt-6 w-full max-w-[460px]

                    lg:mt-[calc(var(--u)*22)]
                    lg:w-[calc(var(--u)*430)]
                    lg:max-w-none
                  "
                >
                  {advisors.slice(0, PANEL_LIMIT).map((advisor) => (
                    <li key={advisor.slug} className="border-t border-white/35 last:border-b">
                      <a
                        href={`/advisors/${advisor.slug}`}
                        className="
                          group block py-[11px]

                          lg:py-[calc(var(--u)*10)]
                        "
                      >
                        <span className="flex items-baseline justify-between gap-4">
                          <span
                            className="
                              text-[15px] font-bold leading-[20px]
                              group-hover:underline group-hover:underline-offset-2

                              lg:text-[calc(var(--u)*15)]
                              lg:leading-[calc(var(--u)*20)]
                            "
                          >
                            {advisor.name}
                          </span>
                          <span
                            className="
                              shrink-0 text-[13px] font-bold leading-[20px]

                              lg:text-[calc(var(--u)*13)]
                              lg:leading-[calc(var(--u)*20)]
                            "
                          >
                            <span className="mr-[6px] text-[11px] font-normal text-white/80 lg:text-[calc(var(--u)*11)]">No upfront payment</span>
                            {formatPrice(advisor.currentPrice)}
                          </span>
                        </span>
                        <span
                          className="
                            mt-[3px] block truncate text-[12px] leading-[17px] text-white/85

                            lg:mt-[calc(var(--u)*3)]
                            lg:text-[calc(var(--u)*12)]
                            lg:leading-[calc(var(--u)*17)]
                          "
                        >
                          {advisor.platforms.join(" / ")} · by {advisor.vendor.displayName} · {advisor.shortDescription}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p
                  data-px="roles.investgpt.price-note"
                  className="
                    mt-3 max-w-[460px] text-[12px] leading-[17px] text-white/85

                    lg:mt-[calc(var(--u)*10)]
                    lg:w-[calc(var(--u)*430)]
                    lg:max-w-none
                    lg:text-[calc(var(--u)*12)]
                    lg:leading-[calc(var(--u)*17)]
                  "
                >
                  License prices are not paid upfront. Covering a price does not grant ownership or permanent access.
                </p>
                </>
              ) : (
                <p
                  data-px="roles.investgpt.description"
                  className="
                    mt-6 text-[13px]
                    leading-[18px] text-white/95

                    lg:mt-[calc(var(--u)*22)]
                    lg:text-[calc(var(--u)*13)]
                    lg:leading-[calc(var(--u)*18)]
                  "
                >
                  The first advisors are in evaluation. Listings appear only when approved.
                </p>
              )}

              {hasAdvisors ? null : (
              <ul
                data-px="roles.investgpt.features"
                className="
                  mt-5 space-y-[7px]
                  text-[13px] leading-none

                  lg:mt-[calc(var(--u)*21)]
                  lg:space-y-[calc(var(--u)*7)]
                  lg:text-[calc(var(--u)*13)]
                "
              >
                <li>→ &nbsp; Dated test evidence and known limits</li>
                <li>→ &nbsp; Compatible brokers and account types</li>
                <li>→ &nbsp; Approved license price and support terms</li>
              </ul>
              )}

              {hasAdvisors ? (
                // Unchanged behaviour: a full page load to the catalog, as before this split.
                // eslint-disable-next-line @next/next/no-html-link-for-pages
                <a
                  data-px="roles.investgpt.cta"
                  href="/advisors"
                  className="
                    mt-8 lg:mt-[calc(var(--u)*26)]
                    inline-flex
                    text-[13px] font-bold
                    leading-none text-white

                    lg:text-[calc(var(--u)*13)]
                  "
                >
                  {`View all ${advisors.length > PANEL_LIMIT ? `${advisors.length} ` : ""}advisors`}
                  &nbsp; →
                </a>
              ) : (
                <OnboardingAction
                  dataPx="roles.investgpt.cta"
                  href={links.register}
                  className="
                    mt-12 lg:mt-[calc(var(--u)*51)]
                    inline-flex
                    text-[13px] font-bold
                    leading-none text-white

                    lg:text-[calc(var(--u)*13)]
                  "
                >
                  Create Your Account &nbsp; →
                </OnboardingAction>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Benefit icons: one family (24px grid, 1.6px round strokes, no fills) shown in 46px
 * tinted tiles. license = key, coins = partner commission, wallet = continued access.
 */
function RoleIcon({ type }: { type: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-[24px] w-[24px] lg:h-[max(calc(var(--u)*24),21px)] lg:w-[max(calc(var(--u)*24),21px)]",
    "aria-hidden": true,
  };

  if (type === "license") {
    return (
      <svg {...common}>
        <circle cx="7.75" cy="16.25" r="4.6" />
        <path d="M11 13 20.75 3.25" />
        <path d="M17.25 6.75 19.75 9.25" />
        <path d="M14.5 9.5 16.5 11.5" />
        <circle cx="7.75" cy="16.25" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "coins") {
    return (
      <svg {...common}>
        <ellipse cx="9.5" cy="5.75" rx="6" ry="2.5" />
        <path d="M3.5 5.75v4.5c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5v-4.5" />
        <path d="M3.5 10.25v4.5c0 1.38 2.69 2.5 6 2.5" />
        <circle cx="17.25" cy="16.75" r="4.25" strokeOpacity="0.35" />
        <path d="M17.25 12.5a4.25 4.25 0 1 1-4.25 4.25" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M5.5 7.25V6.4c0-.87.8-1.52 1.65-1.34l9.6 2.19" />
      <rect x="3.5" y="7.25" width="17" height="12" rx="2.5" />
      <path d="M20.5 11.25h-3.25a2 2 0 0 0 0 4h3.25" />
      <circle cx="17.4" cy="13.25" r="0.85" fill="currentColor" stroke="none" />
    </svg>
  );
}
