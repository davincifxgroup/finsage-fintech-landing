/**
 * ForexLAB Access catalog: read-only client for the Rebate (Django) public API.
 *
 * Django is the source of truth. This site never reads Django's database and keeps no
 * copy of the catalog. Data is fetched on the server (build time + incremental
 * revalidation) from:
 *
 *   GET {ACCESS_CATALOG_API_URL}/advisors/          -> { version, generatedAt, advisors: AdvisorCard[] }
 *   GET {ACCESS_CATALOG_API_URL}/advisors/{slug}/   -> { version, advisor: AdvisorDetail }  (404 if not public)
 *
 * ACCESS_CATALOG_API_URL defaults to `${REBATE_URL}/api/access/catalog`.
 * ACCESS_CATALOG_REVALIDATE_SECONDS (default 60; 0 = no caching, for local review).
 *
 * If the API cannot be reached the page shows the honest empty state; nothing is
 * invented or cached locally as a fallback.
 *
 * Import only from server components (pages/layouts): the API URL is server config.
 */
import { unstable_rethrow } from "next/navigation";

import { REBATE_URL } from "@/lib/site";

export const CATALOG_API_VERSION = 1;

export type Price = { amount: string; currency: "USD"; effectiveFrom: string };

export type AdvisorCard = {
  slug: string;
  name: string;
  vendor: { displayName: string };
  shortDescription: string;
  platforms: string[];
  brokers: string[];
  currentPrice: Price;
  publishedAt: string | null;
};

export type Evidence = {
  title: string;
  evaluatedOn: string;
  periodStart: string | null;
  periodEnd: string | null;
  source: string;
  summary: string;
};

export type Compatibility = { broker: string; accountType: string; platform: string; note: string };

export type AdvisorDetail = AdvisorCard & {
  description: string;
  evaluationSummary: string;
  evidence: Evidence[];
  knownLimitations: string;
  compatibility: Compatibility[];
  licenseTerms: string;
  supportTerms: string;
  updatedAt: string;
};

const apiBase = () =>
  (process.env.ACCESS_CATALOG_API_URL ?? `${REBATE_URL}/api/access/catalog`).replace(/\/$/, "");

const revalidateSeconds = () => {
  const raw = Number(process.env.ACCESS_CATALOG_REVALIDATE_SECONDS ?? "60");
  return Number.isFinite(raw) && raw >= 0 ? raw : 60;
};

const fetchOptions = (): RequestInit & { next?: { revalidate: number } } => {
  const seconds = revalidateSeconds();
  return seconds === 0 ? { cache: "no-store" } : { next: { revalidate: seconds } };
};

const isSlug = (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

export async function getPublishedAdvisors(): Promise<AdvisorCard[]> {
  try {
    const response = await fetch(`${apiBase()}/advisors/`, fetchOptions());
    if (!response.ok) {
      console.error(`[access-catalog] advisor list returned HTTP ${response.status}`);
      return [];
    }
    const body = await response.json();
    if (body?.version !== CATALOG_API_VERSION || !Array.isArray(body.advisors)) {
      console.error("[access-catalog] unexpected advisor list payload");
      return [];
    }
    return body.advisors as AdvisorCard[];
  } catch (error) {
    // Let Next.js control-flow signals (dynamic rendering, notFound, redirect) through.
    unstable_rethrow(error);
    console.error("[access-catalog] advisor list unavailable:", (error as Error).message);
    return [];
  }
}

/** null when the advisor is not public (404) or the API is unavailable. */
export async function getPublishedAdvisor(slug: string): Promise<AdvisorDetail | null> {
  if (!isSlug(slug)) {
    return null;
  }
  try {
    const response = await fetch(`${apiBase()}/advisors/${slug}/`, fetchOptions());
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      console.error(`[access-catalog] advisor ${slug} returned HTTP ${response.status}`);
      return null;
    }
    const body = await response.json();
    if (body?.version !== CATALOG_API_VERSION || !body.advisor) {
      console.error(`[access-catalog] unexpected payload for advisor ${slug}`);
      return null;
    }
    return body.advisor as AdvisorDetail;
  } catch (error) {
    // Let Next.js control-flow signals (dynamic rendering, notFound, redirect) through.
    unstable_rethrow(error);
    console.error(`[access-catalog] advisor ${slug} unavailable:`, (error as Error).message);
    return null;
  }
}

/** "$1,234.50": display formatting only; the Decimal string from Django is the value. */
export function formatPrice(price: Price) {
  const [whole, cents = "00"] = price.amount.split(".");
  return `$${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${cents.padEnd(2, "0").slice(0, 2)}`;
}

export function formatDate(value: string | null) {
  if (!value) {
    return "";
  }
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}
