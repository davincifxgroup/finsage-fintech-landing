"use client";

import { useEffect, useRef } from "react";

import { registerPage, type CatalogMode } from "@/lib/analytics";

/**
 * Confirms a known page: declares its analytics path, loads the tag on the first
 * confirmed page, and sends one page_view per visit followed by the view event. Each
 * mount is one visit (direct load, client-side navigation, back/forward, or back from a
 * 404); #section jumps do not remount and send nothing. Rendered only by pages that
 * exist: "/", "/advisors" and an advisor the page actually rendered.
 */
export function AnalyticsPage({
  route,
  catalogMode,
  advisorSlug,
  title,
}: {
  route: "home" | "catalog" | "advisor";
  catalogMode: CatalogMode;
  advisorSlug?: string;
  /** The page's own title (same value as its metadata), sent as page_title. */
  title: string;
}) {
  // React Strict Mode runs effects twice on the same instance in development.
  const visited = useRef(false);

  useEffect(() => {
    if (visited.current) return;
    visited.current = true;
    registerPage(route, catalogMode, title, advisorSlug);
  }, [route, catalogMode, advisorSlug, title]);

  return null;
}
