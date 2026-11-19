"use client";

import { useEffect } from "react";

import { pageView } from "@/lib/analytics";

/**
 * A page restored from the back/forward cache (for example, coming back from Rebate) is
 * a new visit without a React render, so pageshow re-sends its view. Ordinary views are
 * sent by <AnalyticsPage> on known pages.
 */
export function PageViews() {
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) pageView(true);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
