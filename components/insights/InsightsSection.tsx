import { activeBrokers } from "@/content/brokers";

import { ResearchEvidence } from "./ResearchEvidence";

// Evaluation methodology. Labels only: no metrics are shown. Non-interactive.
const methodology = [
  "Real-Tick Backtesting",
  "Realistic Execution Costs",
  "Out-of-Sample Validation",
  "Risk & Robustness Analysis",
  "Forward Performance Verification",
];

// Generated from active Rebate Broker records (see content/brokers.ts).
// Compatibility is confirmed per advisor; brokers do not endorse listed advisors.
const brokers = activeBrokers.map((broker) => broker.name);

// ForexLAB's research and selection process (the same for every advisor).
const steps = [
  {
    title: "Discovery",
    description: "AI-assisted research to identify promising trading algorithms.",
  },
  {
    title: "Testing",
    description: "Real-tick backtests, trading costs, and out-of-sample testing.",
  },
  {
    title: "Verification",
    description: "Cross-checking backtests against verified trading records.",
  },
  {
    title: "Due Diligence",
    description: "User feedback, developer reputation, and strategy risks.",
  },
  {
    title: "Selection",
    description: "Only approved EAs with favorable licensing terms.",
  },
];

export function InsightsSection() {
  return (
    <section
      id="testing"
      data-px="insights"
      className="
        insights relative isolate
        min-h-[100svh] w-full overflow-hidden bg-white
        [font-family:Lato,Arial,sans-serif]
      "
    >
      {/*
        ============================================================
        BACKGROUND DESIGN FRAME
        ------------------------------------------------------------
        Reference: 1202 × 806
        Mode: COVER

        This fills the viewport without stretching the reference
        coordinate system independently on X/Y.
        ============================================================
      */}
      <div
        aria-hidden="true"
        data-px="insights.background"
        className="
          pointer-events-none absolute left-1/2 top-0 z-0
          aspect-[1202/806]
          w-[max(100vw,calc(100svh*1.4913151365))]
          -translate-x-1/2
          [container-type:inline-size]
          [--u:0.0831946755cqw]
        "
      >
        <div
          className="
            absolute inset-x-0 top-0
            h-[calc(var(--u)*330)]
            bg-[radial-gradient(ellipse_at_16%_0%,rgba(255,214,236,0.72)_0%,rgba(255,226,241,0.35)_32%,transparent_65%),radial-gradient(ellipse_at_88%_2%,rgba(214,233,255,0.78)_0%,rgba(232,242,255,0.42)_34%,transparent_67%)]
          "
        />
      </div>

      {/*
        ============================================================
        CONTENT DESIGN FRAME
        ------------------------------------------------------------
        Reference: 1202 × 806
        Mode: CONTAIN

        --u = one reference pixel.

        At 1202 × 806:
          1u = 1px

        On larger/smaller desktop screens every coordinate,
        dimension, spacing and font scales by exactly the same factor.
        ============================================================
      */}
      {/*
        The design frame keeps one viewport on desktop (the pinned reveal shows exactly
        this). The research examples follow below it, inside the same section.
      */}
      <div data-px="insights.frame" className="relative lg:h-[100svh]">
      <div
        className="
          relative z-10 mx-auto w-full
          px-5 py-12
          sm:px-8
          lg:absolute
          lg:left-1/2 lg:top-1/2
          lg:aspect-[1202/806]
          lg:w-[min(100vw,calc(100svh*1.4913151365))]
          lg:-translate-x-1/2 lg:-translate-y-1/2
          lg:p-0
          lg:[container-type:inline-size]
          lg:[--u:0.0831946755cqw]
        "
      >
        {/* ====================================================== */}
        {/* HEADER                                                 */}
        {/* ====================================================== */}

        <div
          data-px="insights.header"
          className="
            mx-auto flex w-full max-w-[968px]
            flex-col items-center

            lg:absolute
            lg:left-[calc(var(--u)*117)]
            lg:top-0
            lg:block
            lg:h-[calc(var(--u)*257)]
            lg:w-[calc(var(--u)*968)]
            lg:max-w-none
          "
        >
          <h2
            data-px="insights.title"
            className="
              text-center text-[34px] font-black
              leading-[1.02] tracking-[-0.05em] text-black
              sm:text-[42px]

              lg:absolute
              lg:left-1/2
              lg:top-[calc(var(--u)*56)]
              lg:w-max
              lg:max-w-none
              lg:-translate-x-1/2
              lg:text-[calc(var(--u)*45)]
              lg:leading-[calc(var(--u)*50)]
              lg:tracking-[-0.05em]
            "
          >
            <span className="block text-balance lg:whitespace-nowrap">
              A Backtest Is Not Proof.
            </span>

            <span className="block text-balance lg:whitespace-nowrap">
              Our Evaluation Goes Further.
            </span>
          </h2>

          <p
            data-px="insights.subtitle"
            className="
              mt-6 max-w-[560px] text-center
              text-[14px] font-normal leading-[21px]
              text-[#5f5f5f]

              lg:absolute
              lg:left-1/2
              lg:top-[calc(var(--u)*174)]
              lg:mt-0
              lg:w-max
              lg:max-w-none
              lg:-translate-x-1/2
              lg:text-[calc(var(--u)*14)]
              lg:leading-[calc(var(--u)*20)]
            "
          >
            Every Expert Advisor must undergo independent technical evaluation before
            it can be listed on ForexLAB Access.
          </p>

          <ul
            data-px="insights.tabs"
            aria-label="Evaluation methodology"
            className="
              mt-8 flex max-w-full
              flex-wrap items-center justify-center gap-[4px]

              lg:absolute
              lg:left-1/2
              lg:top-[calc(var(--u)*226)]
              lg:mt-0
              lg:w-max
              lg:-translate-x-1/2
              lg:flex-nowrap
              lg:gap-[calc(var(--u)*4)]
            "
          >
            {methodology.map((label, index) => (
              <li
                key={label}
                data-px={`insights.tab.${index + 1}`}
                className="
                  inline-flex items-center whitespace-nowrap
                  h-[28px]
                  rounded-[5px]
                  bg-[#f3f3f5]
                  px-[12px]
                  text-[11px]
                  font-medium
                  leading-none
                  text-[#333]

                  lg:h-[calc(var(--u)*30)]
                  lg:rounded-[calc(var(--u)*5)]
                  lg:px-[calc(var(--u)*13)]
                  lg:text-[max(10.5px,calc(var(--u)*11.5))]
                "
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* ====================================================== */}
        {/* MAIN CONTENT                                           */}
        {/* ====================================================== */}

        <div
          data-px="insights.content"
          className="
            mx-auto mt-12 grid
            w-full max-w-[969px]
            grid-cols-1 gap-12

            lg:absolute
            lg:left-[calc(var(--u)*117)]
            lg:top-[calc(var(--u)*297)]
            lg:mt-0
            lg:h-[calc(var(--u)*460)]
            lg:w-[calc(var(--u)*969)]
            lg:max-w-none
            lg:grid-cols-[calc(var(--u)*350)_calc(var(--u)*535)]
            lg:justify-between
            lg:gap-0
          "
        >
          {/* ==================================================== */}
          {/* PROCESS PANEL (first on mobile, right on desktop)    */}
          {/* ==================================================== */}

          <div
            data-px="insights.process"
            className="
              relative
              overflow-hidden
              rounded-[6px]
              bg-[#f4f4f6]
              px-4 py-8
              sm:px-8

              lg:order-2
              lg:self-center
              lg:w-[calc(var(--u)*535)]
              lg:rounded-[calc(var(--u)*6)]
              lg:py-[calc(var(--u)*34)]
              lg:pl-[calc(var(--u)*58)]
              lg:pr-[calc(var(--u)*34)]
            "
          >
            <ol
              data-px="insights.pipeline"
              aria-label="Research and selection process"
              className="
                relative ml-[24px]
                flex flex-col gap-[8px]

                lg:ml-0
                lg:gap-[calc(var(--u)*6)]
              "
            >
              {steps.map((step, index) => {
                const number = String(index + 1).padStart(2, "0");
                const last = index === steps.length - 1;
                return (
                  <li
                    key={step.title}
                    data-px={`insights.pipeline.${index + 1}`}
                    className="relative"
                  >
                    {!last ? (
                      <>
                        {/* Static track, then the rail drawn over it on scroll */}
                        <span
                          aria-hidden="true"
                          className="
                            absolute left-[-20px] top-[21px]
                            h-[calc(100%+8px)] w-px bg-[#dedede]

                            lg:left-[calc(var(--u)*-20)]
                            lg:top-[calc(var(--u)*25)]
                            lg:h-[calc(100%+var(--u)*6)]
                            lg:w-[calc(var(--u)*1)]
                          "
                        />
                        <span
                          data-motion={`insights-rail-${index + 1}`}
                          aria-hidden="true"
                          className="
                            absolute left-[-20px] top-[21px] z-10
                            h-[calc(100%+8px)] w-px origin-top bg-black

                            lg:left-[calc(var(--u)*-20)]
                            lg:top-[calc(var(--u)*25)]
                            lg:h-[calc(100%+var(--u)*6)]
                            lg:w-[calc(var(--u)*1)]
                          "
                        />
                      </>
                    ) : null}

                    {/* Timeline node */}
                    <span
                      data-motion={`insights-node-${index + 1}`}
                      aria-hidden="true"
                      className="
                        absolute z-20
                        left-[-23px] top-[17px]
                        h-[8px] w-[8px]
                        rounded-full border border-black bg-black

                        lg:left-[calc(var(--u)*-23)]
                        lg:top-[calc(var(--u)*21)]
                        lg:h-[calc(var(--u)*8)]
                        lg:w-[calc(var(--u)*8)]
                      "
                    />

                    {/* Step */}
                    <div
                      data-px={`insights.pipeline.${index + 1}.card`}
                      className="
                        flex items-start gap-3
                        rounded-[5px] bg-white
                        px-[14px] py-[12px]

                        lg:min-h-[calc(var(--u)*50)]
                        lg:items-center
                        lg:gap-[calc(var(--u)*12)]
                        lg:rounded-[calc(var(--u)*5)]
                        lg:px-[calc(var(--u)*14)]
                        lg:py-[calc(var(--u)*8)]
                      "
                    >
                      <span
                        aria-hidden="true"
                        data-px={`insights.pipeline.${index + 1}.number`}
                        className="
                          w-[26px] shrink-0
                          text-[16px] font-black leading-[18px]
                          tracking-[-0.02em] text-black tabular-nums

                          lg:w-[calc(var(--u)*26)]
                          lg:text-[calc(var(--u)*16)]
                          lg:leading-[calc(var(--u)*18)]
                        "
                      >
                        {number}
                      </span>

                      <div
                        className="
                          flex min-w-0 flex-1 flex-col gap-[4px]

                          lg:flex-row lg:items-center
                          lg:gap-[calc(var(--u)*12)]
                        "
                      >
                        <h4
                          data-px={`insights.pipeline.${index + 1}.title`}
                          className="
                            text-[14px] font-bold leading-[18px] text-black

                            lg:w-[calc(var(--u)*100)]
                            lg:shrink-0
                            lg:whitespace-nowrap
                            lg:text-[calc(var(--u)*14)]
                            lg:leading-[calc(var(--u)*18)]
                          "
                        >
                          <span className="sr-only">{`Step ${number}: `}</span>
                          {step.title}
                        </h4>

                        <p
                          data-px={`insights.pipeline.${index + 1}.description`}
                          className="
                            text-[12.5px] font-normal leading-[18px] text-[#666]

                            lg:text-[max(11px,calc(var(--u)*12.5))]
                            lg:leading-[calc(var(--u)*17)]
                          "
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* ==================================================== */}
          {/* BROKER SELECTION (below on mobile, left on desktop)  */}
          {/* ==================================================== */}

          <div
            id="brokers"
            data-px="insights.copy"
            className="
              flex flex-col

              lg:order-1
              lg:h-[calc(var(--u)*460)]
              lg:w-[calc(var(--u)*350)]
              lg:justify-center
            "
          >
            {/* Label */}
            <div
              data-px="insights.label"
              className="
                flex items-center gap-[8px]
                lg:gap-[calc(var(--u)*8)]
              "
            >
              <span
                aria-hidden="true"
                className="
                  h-[7px] w-[7px]
                  shrink-0 rounded-full bg-black

                  lg:h-[calc(var(--u)*7)]
                  lg:w-[calc(var(--u)*7)]
                "
              />

              <span
                className="
                  text-[12px] font-medium leading-none text-black

                  lg:text-[calc(var(--u)*12)]
                "
              >
                Broker Selection
              </span>
            </div>

            <h3
              data-px="insights.feature-title"
              className="
                mt-6 max-w-[330px]
                text-[26px] font-black
                leading-[29px]
                tracking-[-0.035em]
                text-black

                lg:mt-[calc(var(--u)*22)]
                lg:max-w-none
                lg:text-[calc(var(--u)*26)]
                lg:leading-[calc(var(--u)*29)]
              "
            >
              Selected for
              <br />
              Algorithmic Trading.
            </h3>

            <p
              data-px="insights.description"
              className="
                mt-4 max-w-[350px]
                text-[13.5px]
                font-normal
                leading-[21px]
                text-[#5f5f5f]

                lg:mt-[calc(var(--u)*14)]
                lg:max-w-none
                lg:text-[max(11.5px,calc(var(--u)*13.5))]
                lg:leading-[calc(var(--u)*21)]
              "
            >
              We partner with reputable brokers selected for their execution quality,
              competitive trading costs, and suitability for automated strategies.
            </p>

            <ul
              data-px="insights.integrations"
              aria-label="Partner brokers"
              className="
                mt-5
                flex flex-wrap gap-[4px]

                lg:mt-[calc(var(--u)*18)]
                lg:gap-[calc(var(--u)*4)]
              "
            >
              {brokers.map((name, index) => (
                <li
                  key={name}
                  data-px={`insights.integration.${index + 1}`}
                  className="
                    inline-flex
                    h-[26px]
                    items-center
                    justify-center
                    rounded-[4px]
                    border border-[#e6e6ea]
                    bg-white
                    px-[11px]
                    text-[11px]
                    font-medium
                    leading-none
                    text-black

                    lg:h-[calc(var(--u)*26)]
                    lg:rounded-[calc(var(--u)*4)]
                    lg:border-[length:calc(var(--u)*1)]
                    lg:px-[calc(var(--u)*11)]
                    lg:text-[max(10.5px,calc(var(--u)*11.5))]
                  "
                >
                  {name}
                </li>
              ))}
            </ul>

            <p
              data-px="insights.integrations-note"
              className="
                mt-3 max-w-[350px]
                text-[11.5px] leading-[17px] text-[#808080]

                lg:mt-[calc(var(--u)*11)]
                lg:max-w-none
                lg:text-[max(10.5px,calc(var(--u)*11.5))]
                lg:leading-[calc(var(--u)*17)]
              "
            >
              Compatibility is confirmed separately for each advisor. Brokers do not
              endorse or certify the advisors listed on ForexLAB Access.
            </p>

            <a
              data-px="insights.execute"
              href="#how-it-works"
              className="
                mt-7 inline-flex w-fit items-center
                text-[12px] font-bold leading-none text-black

                lg:mt-[calc(var(--u)*26)]
                lg:text-[calc(var(--u)*12)]
              "
            >
              How It Works

              <span
                aria-hidden="true"
                className="
                  ml-[4px]
                  text-[16px]
                  font-normal

                  lg:ml-[calc(var(--u)*4)]
                  lg:text-[calc(var(--u)*16)]
                "
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
      </div>

      <ResearchEvidence />
    </section>
  );
}
