"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { pageView, syncPage } from "@/lib/analytics";

/**
 * Route changes: when no known page claims the new pathname (a 404 or an unknown
 * advisor), collection stops until one does. A page restored from the back/forward
 * cache (for example, coming back from Rebate) is a new visit without a React render,
 * so pageshow re-sends its view. Ordinary views are sent by <AnalyticsPage>.
 */
export function PageViews() {
  const pathname = usePathname();

  useEffect(() => {
    syncPage();
  }, [pathname]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) pageView();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
