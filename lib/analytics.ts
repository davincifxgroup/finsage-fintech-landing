/**
 * ForexLAB Access analytics (see deployment/access-analytics.md).
 *
 * Off by default. GA4 loads only when the build sets all of:
 *   NEXT_PUBLIC_ANALYTICS_ENABLED=true   (owner approval, after the consent review)
 *   NEXT_PUBLIC_GA4_ID=G-...             (the approved web stream; test stream for review)
 * and only on hosts in NEXT_PUBLIC_ANALYTICS_HOSTS (default access.ea-forexlab.com), so
 * local and test traffic never reaches production. NEXT_PUBLIC_GA4_DEBUG_MODE=true adds
 * debug_mode for DebugView (test streams only).
 *
 * Every event and parameter is allowlisted below. Nothing else is sent: no URLs, emails,
 * account numbers or form values. Advisor slugs are public catalog slugs only.
 */

export type CatalogMode = "demo" | "live" | "empty";

export const GA4_ID = (process.env.NEXT_PUBLIC_GA4_ID ?? "").trim();
export const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" && /^G-[A-Z0-9]+$/.test(GA4_ID);
export const ANALYTICS_HOSTS = (process.env.NEXT_PUBLIC_ANALYTICS_HOSTS || "access.ea-forexlab.com")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);
export const GA4_DEBUG_MODE = process.env.NEXT_PUBLIC_GA4_DEBUG_MODE === "true";

/** Demo fixtures, live listings or the honest empty state. */
export const catalogModeOf = (advisors: { demo?: true }[]): CatalogMode =>
  advisors.length === 0 ? "empty" : advisors.some((advisor) => advisor.demo) ? "demo" : "live";

/** Fixed CTA placements. */
export const PLACEMENTS = [
  "hero_primary",
  "hero_login",
  "header_login",
  "header_vendor",
  "roles_advisor",
  "roles_view_all",
  "roles_create_account",
  "catalog_card",
  "catalog_empty_create_account",
  "advisor_detail_back",
  "advisor_detail_get_advisor",
  "advisor_detail_create_account",
  "final_cta",
  "faq_setup_request",
  "footer_login",
  "footer_vendor",
  "footer_register",
  "footer_dashboard",
  "footer_rebate",
] as const;
export type Placement = (typeof PLACEMENTS)[number];

/** In-site destinations (access_cta_click) and Rebate destinations (rebate_handoff_click). */
export const SITE_DESTINATIONS = ["advisors_section", "catalog", "advisor_detail"] as const;
export const REBATE_DESTINATIONS = ["login", "dashboard", "register", "vendor_portal", "support", "rebate_home"] as const;
export type SiteDestination = (typeof SITE_DESTINATIONS)[number];
export type RebateDestination = (typeof REBATE_DESTINATIONS)[number];

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MODES: CatalogMode[] = ["demo", "live", "empty"];

type Spec = { params: string[]; values?: Record<string, readonly string[]> };

export const EVENTS: Record<string, Spec> = {
  access_cta_click: {
    params: ["cta_placement", "destination", "catalog_mode", "advisor_slug"],
    values: { cta_placement: PLACEMENTS, destination: SITE_DESTINATIONS, catalog_mode: MODES },
  },
  rebate_handoff_click: {
    params: ["cta_placement", "destination", "catalog_mode", "advisor_slug"],
    values: { cta_placement: PLACEMENTS, destination: REBATE_DESTINATIONS, catalog_mode: MODES },
  },
  catalog_view: { params: ["catalog_mode"], values: { catalog_mode: MODES } },
  advisor_view: { params: ["advisor_slug", "catalog_mode"], values: { catalog_mode: MODES } },
};

export type AnalyticsParams = Record<string, string | undefined>;

/** The allowlisted subset of `params` for `event`, or null for an unknown event. */
export function cleanParams(event: string, params: AnalyticsParams): Record<string, string> | null {
  const spec = EVENTS[event];
  if (!spec) return null;
  const out: Record<string, string> = {};
  for (const key of spec.params) {
    const value = params[key];
    if (!value) continue;
    if (spec.values?.[key] && !spec.values[key].includes(value)) continue;
    if (key === "advisor_slug" && !SLUG.test(value)) continue;
    out[key] = value.slice(0, 100);
  }
  return out;
}

type Gtag = (...args: unknown[]) => void;
type SentEvent = { name: string; params: Record<string, string> };

declare global {
  interface Window {
    gtag?: Gtag;
    accessAnalytics?: { sent: SentEvent[]; pending?: SentEvent[] };
  }
}

/** Send an allowlisted event. No-op unless analytics is enabled on this host. */
export function track(event: string, params: AnalyticsParams) {
  if (typeof window === "undefined") return;
  const clean = cleanParams(event, params);
  if (!clean) return;
  // In-memory copy for verification (never stored); filled even when sending is off.
  const log = (window.accessAnalytics ??= { sent: [] });
  if (log.sent.length < 50) log.sent.push({ name: event, params: clean });
  if (typeof window.gtag === "function") {
    window.gtag("event", event, clean);
  } else if (ANALYTICS_ENABLED) {
    // Views tracked during hydration run before the loader; it flushes these.
    (log.pending ??= []).push({ name: event, params: clean });
  }
}

/** data-* attributes for a tracked link. Spread onto <a>. */
export function ctaAttributes(
  placement: Placement,
  destination: SiteDestination | RebateDestination,
  advisorSlug?: string,
): Record<string, string> {
  const event = (REBATE_DESTINATIONS as readonly string[]).includes(destination) ? "rebate_handoff_click" : "access_cta_click";
  return {
    "data-analytics-event": event,
    "data-analytics-placement": placement,
    "data-analytics-destination": destination,
    ...(advisorSlug ? { "data-analytics-advisor-slug": advisorSlug } : {}),
  };
}
