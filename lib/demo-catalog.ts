import type { AdvisorDetail } from "./catalog";

type DemoEnvironment = Record<string, string | undefined>;

/** Explicit presentation mode only. Never an automatic fallback for a failed API. */
export function getDemoCatalog(env: DemoEnvironment): AdvisorDetail[] | null {
  if (env.ACCESS_CATALOG_DEMO !== "true") return null;
  if (env.NEXT_PUBLIC_ACCESS_ONBOARDING === "open") {
    throw new Error("Demo advisors require Access onboarding to remain closed.");
  }
  return examples.map<AdvisorDetail>(({ amount, ...example }) => ({
    ...example,
    demo: true,
    publishedAt: null,
    updatedAt: "",
    currentPrice: { amount, currency: "USD", effectiveFrom: "" },
    description: `${example.shortDescription}\n\nThis is a fictional advisor created to demonstrate the ForexLAB Access listing. No trading software or license is offered.`,
    evaluationSummary: "This area will contain dated backtests, forward monitoring and the full ForexLAB analysis for a real listing. This demo has not been tested or verified, and contains no performance results.",
    evidence: [],
    knownLimitations: "Illustrative strategy description only. No performance, risk limits or broker compatibility have been verified for this fictional advisor.",
    compatibility: example.brokers.map((broker) => ({
      broker,
      accountType: "Example account type",
      platform: example.platforms[0],
      note: "Illustrative only; not approved compatibility.",
    })),
    licenseTerms: "Example terms: one account-bound license, no upfront license payment, and continued access subject to partner-account eligibility. This fictional listing does not create an offer or agreement.",
    supportTerms: "A real listing will specify the developer's support scope and response times. No software or support is supplied for this demonstration.",
    analysisUrl: null,
  }));
}

const examples = [
  {
    slug: "demo-meridian-grid",
    name: "Meridian Grid",
    vendor: { displayName: "Northbeam Algorithms (fictional)" },
    shortDescription: "A fictional EURUSD and GBPUSD grid strategy with a basket stop.",
    platforms: ["MT4", "MT5"],
    brokers: ["IC Markets", "Tickmill"],
    amount: "150.00",
  },
  {
    slug: "demo-kestrel-breakout",
    name: "Kestrel Breakout",
    vendor: { displayName: "Quantile Works (fictional)" },
    shortDescription: "A fictional London-session breakout strategy for major FX pairs.",
    platforms: ["MT5"],
    brokers: ["IC Markets", "FP Markets"],
    amount: "400.00",
  },
  {
    slug: "demo-atlas-trend",
    name: "Atlas Trend",
    vendor: { displayName: "Northbeam Algorithms (fictional)" },
    shortDescription: "A fictional daily trend strategy for major FX pairs and gold.",
    platforms: ["MT5"],
    brokers: ["IC Trading", "Fusion Markets"],
    amount: "300.00",
  },
  {
    slug: "demo-harbor-mean-reversion",
    name: "Harbor Mean Reversion",
    vendor: { displayName: "Quantile Works (fictional)" },
    shortDescription: "A fictional Asian-session mean-reversion strategy for EURCHF and AUDNZD.",
    platforms: ["MT4", "MT5"],
    brokers: ["RoboForex", "Tickmill"],
    amount: "250.00",
  },
];
