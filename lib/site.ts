/**
 * ForexLAB Access: external links and shared content.
 *
 * Authentication, accounts, broker verification and payouts stay in the existing
 * ForexLAB Rebate (Django) application; this landing page only links to it.
 * Override the base URLs at build time with NEXT_PUBLIC_REBATE_URL and
 * NEXT_PUBLIC_MAIN_SITE_URL (for example a local Rebate preview).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const REBATE_URL = (process.env.NEXT_PUBLIC_REBATE_URL ?? "https://rebate.ea-forexlab.com").replace(/\/$/, "");
export const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "https://ea-forexlab.com";

export const links = {
  login: `${REBATE_URL}/login`,
  /**
   * Vendor entry: the protected vendor portal in the Rebate application. Vendors
   * sign in through the same Rebate authentication (no separate user database);
   * anonymous visitors are sent to the Rebate login and return to /vendor/
   * afterward. Override with NEXT_PUBLIC_VENDOR_LOGIN_URL.
   */
  vendorLogin: process.env.NEXT_PUBLIC_VENDOR_LOGIN_URL ?? `${REBATE_URL}/vendor/`,
  register: `${REBATE_URL}/register`,
  dashboard: `${REBATE_URL}/dashboard`,
  rebate: `${REBATE_URL}/`,
  terms: `${REBATE_URL}/terms`,
  privacy: `${REBATE_URL}/privacy`,
  mainSite: MAIN_SITE_URL,
};

/** Advisor selection in the Rebate client dashboard (sign-in first if needed). */
export const selectAdvisorUrl = (slug: string) => `${REBATE_URL}/dashboard/advisors/select/${encodeURIComponent(slug)}/`;

export const asset = (path: string) => `${basePath}${path}`;

export type NavLink = { label: string; href: string };

/** In-page sections, in page order. */
export const sectionNav: NavLink[] = [
  { label: "Advisors", href: "#advisors" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Our Testing", href: "#testing" },
  { label: "Brokers", href: "#brokers" },
  { label: "FAQ", href: "#faq" },
];
