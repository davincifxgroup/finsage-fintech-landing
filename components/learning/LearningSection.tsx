import { assistedSetup, links } from "@/lib/site";

import { FaqAccordion, type FaqItem } from "./FaqAccordion";

// Short answers; the detailed terms stay in the agreement, Terms and the advisor pages.
const faqItems: FaqItem[] = [
  {
    question: "Do I pay anything upfront?",
    answer:
      "No. There is no upfront license payment: broker partner commissions cover the agreed license price over time. Any part that stays uncovered never becomes a debt or a bill. Trading costs and any losses remain yours.",
  },
  {
    question: "Can I use an existing broker account?",
    answer:
      "A new or existing account works once it is confirmed in ForexLAB’s partner group and supported by the advisor you choose. Moving an existing account into the partner group depends on the broker’s approval, so not every account can be transferred.",
  },
  {
    question: "When do I receive the advisor?",
    answer:
      "As soon as ForexLAB confirms your account and the developer issues and activates a license bound to it. You do not wait for commissions to cover the license price.",
  },
  {
    question: "Do Access accounts earn cashback?",
    answer:
      "No. An Access account earns no client cashback, even after its license price is fully covered. Your other accounts on ordinary ForexLAB Rebate are not affected.",
  },
  {
    question: "What happens if I stop trading?",
    answer:
      "After three full calendar months of confirmed inactivity, you receive seven calendar days’ notice before Access is suspended. A missing broker report alone never counts as inactivity. You can request restoration after account verification, with no new license payment and your coverage kept.",
  },
  {
    question: "What happens if I leave the partner group?",
    answer:
      "Access ends, however much of the license price has been covered. The uncovered amount never becomes a payment obligation.",
  },
  {
    question: "Can I move my license to another account?",
    answer:
      "Each transfer needs individual approval from ForexLAB and the developer, and a license runs on one account at a time. The agreed price and the coverage built up so far carry over.",
  },
  {
    question: "Does testing guarantee trading results?",
    answer:
      "No. Historical tests and live monitoring do not guarantee future performance, and trading can result in losses.",
  },
  {
    question: "Can you set everything up for me?",
    answer: (
      <>
        Yes. Optional assisted setup costs {assistedSetup.priceLabel} and includes advisor installation, configuration
        and VPS setup. VPS hosting is not included.{" "}
        <a
          href={assistedSetup.requestUrl}
          className="
            font-bold text-[#2A4FD8] underline decoration-[#2A4FD8]/30 underline-offset-[3px]
            hover:decoration-[#2A4FD8]
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A4FD8]
          "
        >
          Request setup
        </a>
      </>
    ),
  },
];

export function LearningSection() {
  return (
    <section
      id="faq"
      data-px="learning"
      aria-labelledby="faq-title"
      className="
        learning relative w-full bg-[#fdfdfd]
        [font-family:Lato,Arial,sans-serif]
        lg:[container-type:inline-size]
      "
    >
      <div
        data-px="learning.stage"
        className="
          mx-auto grid w-full grid-cols-1 gap-10
          px-5 py-16 sm:px-8 sm:py-20

          lg:grid-cols-[calc(var(--u)*380)_calc(var(--u)*566)]
          lg:justify-between lg:gap-0
          lg:px-[calc(var(--u)*116)] lg:py-[calc(var(--u)*110)]
          lg:[--u:0.083542189cqw]
        "
      >
        <div data-px="learning.header" className="lg:sticky lg:top-[calc(var(--u)*110)] lg:self-start">
          <div data-px="learning.label" className="flex items-center gap-2 lg:gap-[calc(var(--u)*7)]">
            <span
              aria-hidden="true"
              className="h-[7px] w-[7px] shrink-0 rounded-full bg-black lg:h-[calc(var(--u)*7)] lg:w-[calc(var(--u)*7)]"
            />
            <span className="text-[13px] leading-none text-black lg:text-[calc(var(--u)*13)]">FAQ</span>
          </div>

          <h2
            id="faq-title"
            data-px="learning.title"
            className="
              mt-8 max-w-[420px]
              text-[40px] font-black leading-[1.04] tracking-[-0.045em] text-black
              sm:text-[46px]
              lg:mt-[calc(var(--u)*30)] lg:max-w-none
              lg:text-[calc(var(--u)*46)] lg:leading-[calc(var(--u)*51)]
            "
          >
            Before you get started.
          </h2>

          <p
            data-px="learning.description"
            className="
              mt-5 text-[15px] leading-[22px] text-[#646464]
              lg:mt-[calc(var(--u)*18)] lg:text-[calc(var(--u)*15)] lg:leading-[calc(var(--u)*22)]
            "
          >
            Clear terms. No surprises.
          </p>

          <p className="mt-6 text-[12px] leading-[18px] text-[#8a8a8a] lg:mt-[calc(var(--u)*26)] lg:text-[calc(var(--u)*12)] lg:leading-[calc(var(--u)*18)]">
            Full conditions:{" "}
            <a
              href={links.terms}
              className="text-black underline decoration-black/25 underline-offset-[3px] hover:decoration-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A4FD8]"
            >
              Terms
            </a>
          </p>
        </div>

        <FaqAccordion items={faqItems} />
      </div>
    </section>
  );
}
