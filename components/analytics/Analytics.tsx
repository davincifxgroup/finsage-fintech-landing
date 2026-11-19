import Script from "next/script";

import { AnalyticsClicks } from "@/components/analytics/AnalyticsClicks";
import { PageViews } from "@/components/analytics/PageViews";
import {
  ANALYTICS_ENABLED,
  ANALYTICS_HOSTS,
  GA4_DEBUG_MODE,
  GA4_ID,
  GA4_TRANSPORT_URL,
  type CatalogMode,
} from "@/lib/analytics";

/**
 * GA4 loader + click tracking for ForexLAB Access. Renders the loader only when
 * analytics is enabled at build time; the inline script then loads gtag.js only on an
 * allowed host. cookie_domain "auto" stores the _ga cookies on ea-forexlab.com, the
 * same cookies the Rebate tag reads, so a visit continues as one client and session
 * when the visitor moves on to rebate.ea-forexlab.com (no linker needed between
 * subdomains). catalog_mode is set for every event on the page, page views included,
 * so demo traffic can be separated in reports. send_page_view is false: PageViews sends
 * exactly one sanitized page_view per page visit (see lib/analytics.ts).
 */
export function Analytics({ catalogMode }: { catalogMode: CatalogMode }) {
  if (!ANALYTICS_ENABLED) {
    return null;
  }
  const config: Record<string, unknown> = { cookie_domain: "auto", send_page_view: false, catalog_mode: catalogMode };
  if (GA4_DEBUG_MODE) config.debug_mode = true;
  if (GA4_TRANSPORT_URL) config.transport_url = GA4_TRANSPORT_URL;
  const init = `
(function () {
  var hosts = ${JSON.stringify(ANALYTICS_HOSTS)};
  if (hosts.indexOf(window.location.hostname.toLowerCase()) === -1) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('set', { catalog_mode: ${JSON.stringify(catalogMode)} });
  window.gtag('config', ${JSON.stringify(GA4_ID)}, ${JSON.stringify(config)});
  var log = window.accessAnalytics || (window.accessAnalytics = { sent: [], pending: [] });
  (log.pending || []).forEach(function (args) { window.gtag.apply(null, args); });
  log.pending = [];
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(${JSON.stringify(GA4_ID)});
  document.head.appendChild(s);
})();`;
  return (
    <>
      <Script id="access-ga4" strategy="afterInteractive">
        {init}
      </Script>
      <PageViews />
      <AnalyticsClicks catalogMode={catalogMode} />
    </>
  );
}
