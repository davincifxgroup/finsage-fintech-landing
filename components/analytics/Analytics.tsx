import { AnalyticsClicks } from "@/components/analytics/AnalyticsClicks";
import { PageViews } from "@/components/analytics/PageViews";
import { ANALYTICS_ENABLED } from "@/lib/analytics";

/**
 * Analytics for ForexLAB Access (see lib/analytics.ts). Renders nothing unless enabled
 * at build time. It does not load the tag: gtag.js is loaded and initialized only when
 * a known page confirms itself through <AnalyticsPage>, so a direct visit to a 404 or an
 * unknown advisor never loads it. cookie_domain "auto" stores the _ga cookies on
 * ea-forexlab.com, shared with Rebate (no linker needed between subdomains).
 */
export function Analytics() {
  if (!ANALYTICS_ENABLED) {
    return null;
  }
  return (
    <>
      <PageViews />
      <AnalyticsClicks />
    </>
  );
}
