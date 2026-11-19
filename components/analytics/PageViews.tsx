"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { restoreVisit, syncPage } from "@/lib/analytics";

/**
 * Route changes: when no known page claims the new pathname (a 404 or an unknown
 * advisor), collection pauses until one does. A page restored from the back/forward
 * cache (for example, coming back from Rebate) is a new visit without a React render,
 * so pageshow sends it: page_view plus catalog_view/advisor_view, exactly as a fresh
 * visit. Ordinary visits are sent by <AnalyticsPage>.
 */
export function PageViews() {
  const pathname = usePathname();

  useEffect(() => {
    syncPage();
  }, [pathname]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) restoreVisit();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
