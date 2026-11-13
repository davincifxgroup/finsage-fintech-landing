// Non-interactive labels. The first (black) chip is a caption, not a selected tab.
const tabs = ["Your path", "Advisor", "Broker account", "Approval", "Payoff", "Cashback"];

const steps = [
  {
    number: "01",
    title: "Choose an advisor",
    description: "Review its evaluation, broker compatibility and license terms.",
  },
  {
    number: "02",
    title: "Verify your broker account",
    description: "Link an eligible account in the ForexLAB partner program.",
  },
  {
    number: "03",
    title: "Receive your license",
    description: "Once ForexLAB confirms your account, the developer issues the license and delivers the advisor for it.",
  },
  {
    number: "04",
    title: "Commissions cover the price",
    description: "Part of the commission your broker pays us on your trading covers the agreed license price over time.",
  },
  {
    number: "05",
    title: "Cashback after that",
    description: "Once the price is covered, the corresponding share becomes your ForexLAB Rebate cashback.",
  },
];

export function ChallengesSection() {
  return (
    <section
      id="how-it-works"
      data-px="challenges"
      className="
        challenges relative isolate
        min-h-[100svh] w-full overflow-hidden bg-white
        lg:h-[100svh]
        [font-family:Lato,Arial,sans-serif]
      "
    >
      {/*
        ==========================================================
        RESPONSIVE BACKGROUND FRAME
        Reference: 1196 × 799
        Mode: COVER
        ==========================================================
      */}
      <div
        data-px="challenges.background"
        aria-hidden="true"
        className="
          pointer-events-none absolute left-1/2 top-0 z-0
          aspect-[1196/799]
          w-[max(100vw,calc(100svh*1.496871))]
          -translate-x-1/2
          [container-type:inline-size]
          [--u:0.08361204cqw]
        "
      >
        <div
          className="
            absolute inset-0
            bg-white
            bg-[radial-gradient(ellipse_42%_60%_at_100%_78%,rgba(255,206,239,0.58)_0%,rgba(255,221,242,0.26)_34%,transparent_68%),radial-gradient(ellipse_38%_46%_at_9%_100%,rgba(216,232,255,0.72)_0%,rgba(235,243,255,0.35)_34%,transparent_69%),radial-gradient(ellipse_36%_30%_at_85%_44%,rgba(239,235,255,0.32)_0%,transparent_72%)]
          "
        />
      </div>

      {/*
        ==========================================================
        RESPONSIVE DESIGN FRAME
        Reference: 1196 × 799

        --u = exactly one reference pixel at 1196×799.

        Desktop / XL:
        scale = min(viewportWidth / 1196, viewportHeight / 799)

        Mobile / tablet:
        normal document flow.
        ==========================================================
      */}
      <div
        data-px="challenges.stage"
        className="
          relative z-10
          mx-auto w-full
          px-5 py-12
          sm:px-8

          lg:absolute
          lg:left-1/2 lg:top-1/2
          lg:aspect-[1196/799]
          lg:w-[min(100vw,calc(100svh*1.496871))]
          lg:-translate-x-1/2 lg:-translate-y-1/2
          lg:p-0
          lg:[container-type:inline-size]
          lg:[--u:0.08361204cqw]
        "
      >
        {/* ==================================================== */}
        {/* EYEBROW                                              */}
        {/* ==================================================== */}

        <div
          data-px="challenges.label"
          className="
            flex items-center gap-2

            lg:absolute
            lg:left-[calc(var(--u)*114)]
            lg:top-[calc(var(--u)*36)]
            lg:gap-[calc(var(--u)*8)]
          "
        >
          <span
            aria-hidden="true"
            className="
              h-[7px] w-[7px] shrink-0 rounded-full bg-black

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
            How It Works
          </span>
        </div>

        {/* ==================================================== */}
        {/* INTRO                                                */}
        {/* ==================================================== */}

        <div
          data-px="challenges.intro"
          className="
            mt-14 grid grid-cols-1 gap-7

            lg:absolute
            lg:left-[calc(var(--u)*115)]
            lg:top-[calc(var(--u)*104)]
            lg:mt-0
            lg:h-[calc(var(--u)*92)]
            lg:w-[calc(var(--u)*820)]
            lg:grid-cols-[calc(var(--u)*430)_calc(var(--u)*365)]
            lg:justify-between
            lg:gap-0
          "
        >
          <h2
            data-px="challenges.title"
            className="
              max-w-[500px]
              text-[42px] font-black
              leading-[0.98]
              tracking-[-0.045em]
              text-black

              sm:text-[48px]

              lg:w-[calc(var(--u)*430)]
              lg:max-w-none
              lg:text-[calc(var(--u)*45)]
              lg:leading-[calc(var(--u)*52)]
            "
          >
            From Approval
            <br />
            to Cashback.
          </h2>

          <p
            data-px="challenges.description"
            className="
              max-w-[420px]
              text-[14px] font-normal
              leading-[20px] text-black

              lg:pt-[calc(var(--u)*2)]
              lg:w-[calc(var(--u)*365)]
              lg:max-w-none
              lg:text-[calc(var(--u)*13)]
              lg:leading-[calc(var(--u)*20)]
            "
          >
            Choose an advisor, verify your broker account and{" "}
            <br className="hidden lg:block" />
            receive approved access. Commissions cover the{" "}
            <br className="hidden lg:block" />
            license price, then your share returns as cashback.
          </p>
        </div>

        {/* ==================================================== */}
        {/* FILTER TABS                                          */}
        {/* ==================================================== */}

        <ul
          data-px="challenges.tabs"
          aria-label="Access steps"
          className="
            mt-10 flex flex-wrap items-center gap-[2px]

            lg:absolute
            lg:left-[calc(var(--u)*115)]
            lg:top-[calc(var(--u)*246)]
            lg:mt-0
            lg:flex-nowrap
            lg:gap-[calc(var(--u)*2)]
          "
        >
          {tabs.map((tab, index) => (
            <li
              key={tab}
              data-px={`challenges.tab.${index + 1}`}
              className={`
                inline-flex items-center whitespace-nowrap
                h-[27px]
                rounded-[5px]
                px-[14px]
                text-[10px]
                font-normal
                leading-none

                lg:h-[calc(var(--u)*27)]
                lg:rounded-[calc(var(--u)*5)]
                lg:px-[calc(var(--u)*14)]
                lg:text-[calc(var(--u)*10)]

                ${
                  index === 0
                    ? "bg-black text-white"
                    : "bg-[#f4f4f6] text-[#555]"
                }
              `}
            >
              {tab}
            </li>
          ))}
        </ul>

        {/* ==================================================== */}
        {/* TERMINAL / ANALYSIS WINDOW                           */}
        {/* ==================================================== */}

        <div
          data-px="challenges.terminal"
          className="
            mt-7 overflow-hidden
            rounded-[7px] bg-black

            lg:absolute
            lg:left-[calc(var(--u)*115)]
            lg:top-[calc(var(--u)*302)]
            lg:mt-0
            lg:h-[calc(var(--u)*456)]
            lg:w-[calc(var(--u)*968)]
            lg:rounded-[calc(var(--u)*7)]
          "
        >
          {/* Terminal header */}
          <div
            data-px="challenges.terminal.header"
            className="
              flex h-[58px]
              items-center justify-between
              bg-[#2c2a2a]
              px-6

              lg:h-[calc(var(--u)*58)]
              lg:px-[calc(var(--u)*33)]
            "
          >
            <h3
              data-px="challenges.terminal.question"
              className="
                text-[16px] font-bold
                leading-none text-white

                lg:text-[calc(var(--u)*16)]
              "
            >
              How Access works for you
            </h3>

            <div
              data-px="challenges.terminal.controls"
              className="
                flex items-center gap-[7px]

                lg:gap-[calc(var(--u)*7)]
              "
            >
              <span
                aria-hidden="true"
                className="
                  h-[10px] w-[10px] rounded-full bg-[#ff6559]

                  lg:h-[calc(var(--u)*10)]
                  lg:w-[calc(var(--u)*10)]
                "
              />

              <span
                aria-hidden="true"
                className="
                  h-[10px] w-[10px] rounded-full bg-[#ffbd2e]

                  lg:h-[calc(var(--u)*10)]
                  lg:w-[calc(var(--u)*10)]
                "
              />

              <span
                aria-hidden="true"
                className="
                  h-[10px] w-[10px] rounded-full bg-[#27c840]

                  lg:h-[calc(var(--u)*10)]
                  lg:w-[calc(var(--u)*10)]
                "
              />
            </div>
          </div>

          {/* Terminal body */}
          <div
            data-px="challenges.terminal.body"
            className="
              relative h-auto
              overflow-hidden bg-black
              px-6 py-7

              lg:h-[calc(var(--u)*398)]
              lg:px-[calc(var(--u)*34)]
              lg:py-[calc(var(--u)*27)]
            "
          >
            <ol
              data-px="challenges.code"
              aria-label="How Access works"
              className="
                flex flex-col gap-[18px]

                lg:gap-[calc(var(--u)*24)]
              "
            >
              {steps.map((step) => (
                <li
                  key={step.number}
                  data-motion="challenge-code-line"
                  className="
                    grid grid-cols-[34px_1fr] gap-x-3

                    lg:grid-cols-[calc(var(--u)*46)_calc(var(--u)*250)_1fr]
                    lg:items-baseline
                    lg:gap-x-[calc(var(--u)*18)]
                  "
                >
                  <span
                    className="
                      font-mono text-[12px] leading-[20px] text-[#ffbe00]

                      lg:text-[calc(var(--u)*13)]
                      lg:leading-[calc(var(--u)*22)]
                    "
                  >
                    {step.number}
                  </span>
                  <span
                    className="
                      text-[15px] font-bold leading-[20px] text-white

                      lg:text-[calc(var(--u)*16)]
                      lg:leading-[calc(var(--u)*22)]
                    "
                  >
                    {step.title}
                  </span>
                  <span
                    className="
                      col-start-2 mt-1 text-[13px] leading-[19px] text-[#a6a6a6]

                      lg:col-start-3 lg:mt-0
                      lg:text-[calc(var(--u)*13)]
                      lg:leading-[calc(var(--u)*22)]
                    "
                  >
                    {step.description}
                  </span>
                </li>
              ))}

              <li
                data-motion="challenge-code-muted"
                className="
                  mt-2 border-t border-white/10 pt-4
                  text-[12px] leading-[18px] text-[#8d8d8d]

                  lg:mt-[calc(var(--u)*4)]
                  lg:pt-[calc(var(--u)*14)]
                  lg:text-[calc(var(--u)*12)]
                  lg:leading-[calc(var(--u)*18)]
                "
              >
                Trading risk stays with you. Returns are never guaranteed, and there is no
                fixed date by which a license price is covered.
              </li>
            </ol>

            {/* Lower fade */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute
                inset-x-0 bottom-0 h-[36px]
                bg-gradient-to-b
                from-transparent
                via-black/70
                to-black
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}

