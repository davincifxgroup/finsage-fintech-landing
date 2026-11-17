import { assistedSetup, COMING_SOON, links } from "@/lib/site";
import { OnboardingAction } from "@/components/shared/OnboardingAction";

import { FaqAccordion, type FaqItem } from "./FaqAccordion";

// Short answers; the detailed terms stay in the agreement, Terms and the advisor pages.
const faqItems: FaqItem[] = [
  {
    question: "Do I pay anything upfront?",
    answer:
      "No. You do not buy the EA license. ForexLAB Access is funded by the commission our broker partners pay us, and nothing becomes a debt or an invoice later, even if you stop trading.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No. ForexLAB charges nothing for EA access. Your broker’s usual spreads, commissions and swaps still apply, as on any trading account, and the only paid extra is optional assisted setup.",
  },
  {
    question: "How are Expert Advisors selected and tested?",
    answer:
      "ForexLAB evaluates every advisor before it can be listed. Depending on the advisor, this covers backtests on high-quality tick data with realistic spreads and commissions, out-of-sample and forward testing, risk and drawdown analysis, and comparison with live account records where they exist. Each advisor page states what was tested and its known limits.",
  },
  {
    question: "Which brokers and trading accounts are eligible?",
    answer:
      "Your account must be with one of ForexLAB’s broker partners and registered in our partner group. Each advisor page lists the brokers and account types it supports.",
  },
  {
    question: "Can I use an existing broker account?",
    answer:
      "Often, yes. An existing account qualifies once the broker moves it into ForexLAB’s partner group, which depends on the broker’s approval, so not every account can be moved.",
  },
  {
    question: "When can I start using the EA?",
    answer:
      "Once ForexLAB confirms your account in the partner group, the developer issues a license tied to that account. You can download and use the EA as soon as the license is active.",
  },
  {
    question: "Can I use more than one EA?",
    answer:
      "Yes. You can request several advisors, each under the same conditions. Every license is tied to one trading account.",
  },
  {
    question: "Do Access accounts earn cashback?",
    answer:
      "No. An account used for Access does not earn cashback or rebates, because the partner commission funds your EA access. Cashback earned before the account joined Access, and your other ForexLAB Rebate accounts, are not affected.",
  },
  {
    question: "What happens if my trading account becomes inactive?",
    answer:
      "After three full calendar months in a row without confirmed trading, ForexLAB sends you a warning with the reasons and gives you 7 calendar days to respond. Access is suspended only after that review, and missing broker reports never count as inactivity. You can request restoration later at no cost.",
  },
  {
    question: "What happens if my account is no longer linked to a partner?",
    answer:
      "EA access ends when the account leaves ForexLAB’s broker partner group. You owe nothing, and no warning period applies in this case.",
  },
  {
    question: "Can I transfer my EA access to another trading account?",
    answer:
      "Possibly. Each transfer needs individual approval from ForexLAB and the developer, and the new account must be verified in our partner group. A license runs on one trading account at a time.",
  },
  {
    question: "Can you set everything up for me?",
    answer: (
      <>
        Yes. Optional assisted setup costs {assistedSetup.priceLabel} and includes advisor installation, configuration
        and VPS setup. VPS hosting is not included.{" "}
        <OnboardingAction
          href={assistedSetup.requestUrl}
          className="
            font-bold text-[#2A4FD8] underline decoration-[#2A4FD8]/30 underline-offset-[3px]
            hover:decoration-[#2A4FD8]
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A4FD8]
          "
        >
          Request setup
        </OnboardingAction>
      </>
    ),
  },
  {
    question: "Does testing guarantee trading results?",
    answer:
      "No. Testing shows how an advisor behaved under specific historical and live conditions, not how it will perform in the future. Trading involves risk, and you can lose money.",
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
            {/* The Access Terms page is published with Access onboarding (Rebate backend). */}
            <OnboardingAction
              href={links.accessTerms}
              closedLabel={`Access Terms · ${COMING_SOON}`}
              className="text-black underline decoration-black/25 underline-offset-[3px] hover:decoration-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A4FD8]"
            >
              Access Terms
            </OnboardingAction>
          </p>
        </div>

        <FaqAccordion items={faqItems} />
      </div>
    </section>
  );
}
