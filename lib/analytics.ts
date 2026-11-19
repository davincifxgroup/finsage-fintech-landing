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
 * local and test traffic never reaches production. The tag is loaded and initialized
 * only when the app confirms a known page (registerPage); a direct visit to a 404 or an
 * unknown advisor never loads it. Every send is checked at dispatch:
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
    dataLayer?: unknown[];
    accessAnalytics?: { sent: SentEvent[] };
  }
}

/** An enabled build on an allowed hostname. */
function enabledHere(): boolean {
  return (
    ANALYTICS_ENABLED &&
    typeof window !== "undefined" &&
    ANALYTICS_HOSTS.includes(window.location.hostname.toLowerCase())
  );
}

/**
 * True only for an enabled build, on an allowed hostname, for a visitor who has not opted
 * out (window['ga-disable-<ID>'] = true). Checked before the tag is loaded and before
 * every send; an opted-out visitor gets no tag, no queued events and no requests.
 */
export function analyticsActive(): boolean {
  return enabledHere() && !visitorOptedOut();
}

function dispatch(...args: unknown[]) {
  if (!analyticsActive() || !loaded || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

function log(): { sent: SentEvent[] } {
  return (window.accessAnalytics ??= { sent: [] });
}

// gtag's documented opt-out flag: while window['ga-disable-<ID>'] is true, the tag sends
// no hits at all, automatic events included. Two separate reasons can make it true:
//  * the visitor's own opt-out (set by the visitor or a consent tool) — Access never
//    clears it;
//  * Access's temporary pause while a page the app did not confirm (404, unknown
//    advisor) is on screen — lifted when a known page confirms itself.
// When the tag loads, the flag becomes an accessor that keeps the two apart: reads return
// "opted out OR paused", writes from anyone else set the visitor's choice.
const DISABLE_KEY = `ga-disable-${GA4_ID}`;
let loaded = false;
let flagInstalled = false;
let visitorOptOut = false;
let paused = false;

function rawFlag(): boolean {
  return (window as unknown as Record<string, unknown>)[DISABLE_KEY] === true;
}

function visitorOptedOut(): boolean {
  return flagInstalled ? visitorOptOut : rawFlag();
}

function installFlag() {
  if (flagInstalled) return;
  visitorOptOut = rawFlag();
  Object.defineProperty(window, DISABLE_KEY, {
    configurable: true,
    enumerable: true,
    get: () => visitorOptOut || paused,
    set: (value: unknown) => {
      visitorOptOut = value === true;
    },
  });
  flagInstalled = true;
}

/** Access's own temporary pause; never touches the visitor's opt-out. */
function setPaused(on: boolean) {
  paused = on;
}

/** Load and initialize gtag.js once, on the first page the app confirms. */
function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  installFlag();
  const layer = (window.dataLayer ??= []);
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // gtag.js reads the arguments object itself, not an array.
      // eslint-disable-next-line prefer-rest-params
      layer.push(arguments);
    };
  }
  const config: Record<string, unknown> = { cookie_domain: "auto", send_page_view: false };
  if (GA4_DEBUG_MODE) config.debug_mode = true;
  if (GA4_TRANSPORT_URL) config.transport_url = GA4_TRANSPORT_URL;
  // Some published Google tags initialize the GA4 destination when the tag starts
  // ("gtm.init"), before the 'config' command below is read, and send a page_view of the
  // raw URL. Only a 'set' queued before 'js' reaches that step; this one stops that
  // automatic page_view, so the visit's own page_view (sanitized, with catalog_mode) is
  // the only one. Harmless for tags that initialize on 'config'.
  window.gtag("set", { send_page_view: false });
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, config);
  if (typeof document.createElement === "function") {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
    document.head.appendChild(script);
  }
}

const UTM_VALUE = /^[A-Za-z0-9][A-Za-z0-9._+ -]{0,99}$/;
const CLICK_ID_VALUE = /^[A-Za-z0-9_-]{8,200}$/;
const LINKER_VALUE = /^[A-Za-z0-9*._-]{1,300}$/;
const TOKEN_LIKE = /(?=[A-Za-z0-9]*\d)(?=[A-Za-z0-9]*[A-Za-z])[A-Za-z0-9]{24,}/;
// Phone-like: 7+ digits, optionally split by single spaces, dots or hyphens.
const PHONE_LIKE = /\d(?:[ .-]?\d){6,}/;
export const CAMPAIGN_QUERY_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  "gclid", "gbraid", "wbraid", "_gl",
];

/**
 * Same rules as Rebate apps/core/analytics.py, checked against the same examples
 * (tests/analytics/campaign-value-examples.json): tag-like UTM values only, without 6+
 * digit runs, phone-like numbers (7+ digits split by spaces, dots or hyphens) or long
 * token-like strings. Click IDs and the linker keep their own formats.
 */
export function isSafeCampaignValue(key: string, value: string): boolean {
  if (key === "gclid" || key === "gbraid" || key === "wbraid") return CLICK_ID_VALUE.test(value);
  if (key === "_gl") return LINKER_VALUE.test(value);
  return UTM_VALUE.test(value) && !/\d{6,}/.test(value) && !PHONE_LIKE.test(value) && !TOKEN_LIKE.test(value);
}


/**
 * The analytics path for a known route: "/", "/advisors" or "/advisors/<slug>" for an
 * advisor the page actually rendered (published listing or labeled demo fixture).
 * Anything else is null, and nothing is sent for that page.
 */
export function analyticsPath(route: Route, advisorSlug?: string): string | null {
  if (route === "home") return "/";
  if (route === "catalog") return "/advisors";
  return advisorSlug && SLUG.test(advisorSlug) ? `/advisors/${advisorSlug}` : null;
}

/** origin + the known analytics path + safe campaign parameters; never the raw path or hash. */
export function sanitizedLocation(href: string, path: string): string {
  const url = new URL(href);
  const kept = new URLSearchParams();
  for (const key of CAMPAIGN_QUERY_PARAMS) {
    const value = url.searchParams.get(key);
    if (value && isSafeCampaignValue(key, value)) kept.set(key, value);
  }
  const query = kept.toString();
  return `${url.origin}${path}${query ? `?${query}` : ""}`;
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

let firstView = true;
// The page currently on screen, registered by <AnalyticsPage> on known routes only.
// A 404 or an unknown advisor registers nothing, so nothing is sent for it.
type Route = "home" | "catalog" | "advisor";
let registered: {
  pathname: string;
  route: Route;
  path: string;
  advisorSlug?: string;
  catalogMode: CatalogMode;
  title: string;
} | null = null;

function registeredPath(): string | null {
  return registered && registered.pathname === window.location.pathname ? registered.path : null;
}

/**
 * A known page has rendered: one visit. Called once per mount of <AnalyticsPage>, so a
 * page reached again (back/forward, or back from a 404) is a new visit, while #section
 * jumps (no remount) send nothing. Loads the tag on the first confirmed page and lifts
 * Access's own 404 pause (never the visitor's opt-out). An unknown advisor (no valid
 * path) is treated like a 404. The page passes its own title, so the view never depends
 * on when Next.js updates document.title.
 */
export function registerPage(route: Route, catalogMode: CatalogMode, title: string, advisorSlug?: string) {
  if (!enabledHere()) return;
  const path = analyticsPath(route, advisorSlug);
  if (!path) {
    leavePage();
    return;
  }
  registered = { pathname: window.location.pathname, route, path, advisorSlug, catalogMode, title };
  setPaused(false);
  if (!analyticsActive()) return; // visitor opted out: no tag, no events, no requests
  ensureLoaded();
  sendVisit();
}

/**
 * The route changed. If no known page has claimed the new pathname (a 404 or an unknown
 * advisor), pause until one does: no custom events, and the gtag opt-out flag stops
 * automatic events too, so the raw URL is never collected.
 */
export function syncPage() {
  if (!enabledHere() || registeredPath()) return;
  leavePage();
}

function leavePage() {
  registered = null;
  if (loaded) setPaused(true);
}

/**
 * A registered page restored from the back/forward cache (pageshow with persisted) is a
 * new visit: the same page_view and view event as a fresh visit, once.
 */
export function restoreVisit() {
  if (!analyticsActive() || !registeredPath()) return;
  sendVisit();
}

/**
 * One visit: page_view, then catalog_view or advisor_view (home sends page_view only).
 * Later hits on the page reuse the same page fields.
 */
function sendVisit() {
  const page = registered;
  if (!page) return;
  const fields = {
    page_location: sanitizedLocation(window.location.href, page.path),
    page_referrer: firstView ? referrerOrigin(document.referrer) : `${window.location.origin}/`,
    page_title: sanitizeTitle(page.title),
    catalog_mode: page.catalogMode,
  };
  firstView = false;
  dispatch("set", fields);
  dispatch("event", "page_view", fields);
  if (page.route === "catalog") track("catalog_view", {});
  if (page.route === "advisor") track("advisor_view", { advisor_slug: page.advisorSlug });
}

/**
 * Send an allowlisted event. No-op (nothing sent or queued) unless analytics is active
 * and the current page is a registered known page. catalog_mode comes from that page.
 */
export function track(event: string, params: AnalyticsParams) {
  if (!analyticsActive() || !registeredPath() || !registered) return;
  const clean = cleanParams(event, { ...params, catalog_mode: registered.catalogMode });
  if (!clean) return;
  const entries = log().sent;
  if (entries.length < 50) entries.push({ name: event, params: clean });
  dispatch("event", event, clean);
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
