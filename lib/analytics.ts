/**
 * ForexLAB Access analytics (see deployment/access-analytics.md).
 *
 * Off by default. GA4 loads only when the build sets all of:
 *   NEXT_PUBLIC_ANALYTICS_ENABLED=true   (owner approval, after the consent review)
 *   NEXT_PUBLIC_GA4_ID=G-...             (the approved web stream; test stream for review)
 *   NEXT_PUBLIC_GA4_HISTORY_PAGEVIEWS_DISABLED=true
 *       (confirms that the stream's Enhanced Measurement setting "Page changes based on
 *       browser history events" is off. Page views are sent here, once per page visit;
 *       with that setting on, GA4 would add its own page views on every client-side
 *       navigation and every #section jump, and no tag setting can stop it.)
 * and only on hosts in NEXT_PUBLIC_ANALYTICS_HOSTS (default access.ea-forexlab.com), so
 * local and test traffic never reaches production. Every send is checked at dispatch:
 * a disabled build or another hostname never sends or queues anything, even if
 * window.gtag exists. NEXT_PUBLIC_GA4_DEBUG_MODE=true adds debug_mode (test streams);
 * NEXT_PUBLIC_GA4_TRANSPORT_URL sends hits to a local capture server (review only).
 *
 * Every event and parameter is allowlisted below. Nothing else is sent: no emails,
 * account numbers or form values. page_location keeps only campaign parameters with
 * tag-like values, page_referrer is an origin, advisor slugs are public catalog slugs.
 */

export type CatalogMode = "demo" | "live" | "empty";

export const GA4_ID = (process.env.NEXT_PUBLIC_GA4_ID ?? "").trim();
export const ANALYTICS_ENABLED =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" &&
  process.env.NEXT_PUBLIC_GA4_HISTORY_PAGEVIEWS_DISABLED === "true" &&
  /^G-[A-Z0-9]+$/.test(GA4_ID);
export const ANALYTICS_HOSTS = (process.env.NEXT_PUBLIC_ANALYTICS_HOSTS || "access.ea-forexlab.com")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);
export const GA4_DEBUG_MODE = process.env.NEXT_PUBLIC_GA4_DEBUG_MODE === "true";
export const GA4_TRANSPORT_URL = (process.env.NEXT_PUBLIC_GA4_TRANSPORT_URL ?? "").trim();

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
    accessAnalytics?: { sent: SentEvent[]; pending: unknown[][] };
  }
}

/** True only for an enabled build on an allowed hostname. Checked before every send. */
export function analyticsActive(): boolean {
  return (
    ANALYTICS_ENABLED &&
    typeof window !== "undefined" &&
    ANALYTICS_HOSTS.includes(window.location.hostname.toLowerCase())
  );
}

function dispatch(...args: unknown[]) {
  if (!analyticsActive()) return;
  if (typeof window.gtag === "function") {
    window.gtag(...args);
  } else {
    // Before the loader has run (hydration effects): it flushes these in order.
    log().pending.push(args);
  }
}

function log(): { sent: SentEvent[]; pending: unknown[][] } {
  return (window.accessAnalytics ??= { sent: [], pending: [] });
}

const UTM_VALUE = /^[A-Za-z0-9][A-Za-z0-9._+ -]{0,99}$/;
const CLICK_ID_VALUE = /^[A-Za-z0-9_-]{8,200}$/;
const LINKER_VALUE = /^[A-Za-z0-9*._-]{1,300}$/;
const TOKEN_LIKE = /(?=[A-Za-z0-9]*\d)(?=[A-Za-z0-9]*[A-Za-z])[A-Za-z0-9]{24,}/;
export const CAMPAIGN_QUERY_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  "gclid", "gbraid", "wbraid", "_gl",
];

/** Same rules as Rebate apps/core/analytics.py: tag-like values only. */
export function isSafeCampaignValue(key: string, value: string): boolean {
  if (key === "gclid" || key === "gbraid" || key === "wbraid") return CLICK_ID_VALUE.test(value);
  if (key === "_gl") return LINKER_VALUE.test(value);
  return UTM_VALUE.test(value) && !/\d{6,}/.test(value) && !TOKEN_LIKE.test(value);
}

/** origin + path + safe campaign parameters; never the hash or other parameters. */
export function sanitizedLocation(href: string): string {
  const url = new URL(href);
  const kept = new URLSearchParams();
  for (const key of CAMPAIGN_QUERY_PARAMS) {
    const value = url.searchParams.get(key);
    if (value && isSafeCampaignValue(key, value)) kept.set(key, value);
  }
  const query = kept.toString();
  return `${url.origin}${url.pathname}${query ? `?${query}` : ""}`;
}

export function referrerOrigin(referrer: string): string {
  try {
    return referrer ? `${new URL(referrer).origin}/` : "";
  } catch {
    return "";
  }
}

export function sanitizeTitle(title: string): string {
  return title
    .replace(/[^\s@]+@[^\s@]+/g, "[email]")
    .replace(/#\s*\d+/g, "#[id]")
    .replace(/\d{4,}/g, "[n]")
    .slice(0, 150);
}

let currentPath: string | null = null;
let firstView = true;
let lastTitle = "";
// While a client-side page view waits for its title, that page's events wait behind it.
let held: unknown[][] | null = null;
let releaseHeld: (() => void) | null = null;
const TITLE_WAIT_MS = 1000;

function emit(...args: unknown[]) {
  if (held) held.push(args);
  else dispatch(...args);
}

/**
 * One page_view per page visit: the first page, then every pathname change (client-side
 * navigation, back/forward). #section jumps and query-only changes keep the pathname and
 * send nothing. `force` re-sends for a page restored from the back/forward cache.
 * Every later hit on the page uses the same sanitized location, referrer and title.
 * After client-side navigation Next.js sets the new title a moment after the route
 * changes, so the view waits (up to 1 s) for a title other than the previous page's.
 */
export function pageView(force = false) {
  if (!analyticsActive()) return;
  const path = window.location.pathname;
  if (!force && path === currentPath) return;
  currentPath = path;
  releaseHeld?.();
  const location = sanitizedLocation(window.location.href);
  const referrer = firstView ? referrerOrigin(document.referrer) : `${window.location.origin}/`;
  const waitForTitle = !firstView;
  firstView = false;

  const queue: unknown[][] = [];
  held = queue;
  const send = () => {
    if (releaseHeld !== send) return;
    releaseHeld = null;
    window.removeEventListener("pagehide", send);
    lastTitle = document.title;
    const page = { page_location: location, page_referrer: referrer, page_title: sanitizeTitle(document.title) };
    held = null;
    dispatch("set", page);
    dispatch("event", "page_view", page);
    for (const args of queue) dispatch(...args);
  };
  releaseHeld = send;

  const titleReady = () => document.title !== "" && document.title !== lastTitle;
  if (!waitForTitle || titleReady()) {
    send();
    return;
  }
  window.addEventListener("pagehide", send);
  const started = Date.now();
  const poll = () => {
    if (releaseHeld !== send) return;
    if (titleReady() || Date.now() - started >= TITLE_WAIT_MS) send();
    else setTimeout(poll, 50);
  };
  setTimeout(poll, 50);
}

/** Send an allowlisted event. No-op (nothing sent or queued) unless analytics is active. */
export function track(event: string, params: AnalyticsParams) {
  if (!analyticsActive()) return;
  const clean = cleanParams(event, params);
  if (!clean) return;
  pageView(); // a view tracked before the layout's effect still follows its page_view
  const entries = log().sent;
  if (entries.length < 50) entries.push({ name: event, params: clean });
  emit("event", event, clean);
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
