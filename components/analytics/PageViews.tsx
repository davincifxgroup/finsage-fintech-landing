"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { pageView } from "@/lib/analytics";

/**
 * One page_view per page visit: on the first page and whenever the pathname changes
 * (client-side navigation, back/forward). #section jumps do not change the pathname and
 * send nothing. A page restored from the back/forward cache (for example, coming back
 * from Rebate) is a new visit without a React render, so pageshow re-sends it.
 */
export function PageViews() {
  const pathname = usePathname();

  useEffect(() => {
    pageView();
  }, [pathname]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) pageView(true);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
