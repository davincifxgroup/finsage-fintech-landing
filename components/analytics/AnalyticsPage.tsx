"use client";

import { useEffect } from "react";

import { analyticsPath, registerPage, track, type CatalogMode } from "@/lib/analytics";

/**
 * Declares the analytics path of a known page and sends its page view (once per visit,
 * on direct loads, client-side navigation and back/forward), then its view event.
 * Rendered only by pages that exist: "/", "/advisors" and an advisor the page actually
 * rendered. A 404 or unknown advisor never renders it, so its raw path is never sent.
 */
export function AnalyticsPage({
  route,
  catalogMode,
  advisorSlug,
}: {
  route: "home" | "catalog" | "advisor";
  catalogMode: CatalogMode;
  advisorSlug?: string;
}) {
  useEffect(() => {
    const path = analyticsPath(route, advisorSlug);
    registerPage(path);
    if (route === "catalog") track("catalog_view", { catalog_mode: catalogMode });
    if (route === "advisor" && path) track("advisor_view", { advisor_slug: advisorSlug, catalog_mode: catalogMode });
  }, [route, catalogMode, advisorSlug]);

  return null;
}
