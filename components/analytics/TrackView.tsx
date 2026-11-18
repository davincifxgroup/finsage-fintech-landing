"use client";

import { useEffect } from "react";

import { track, type CatalogMode } from "@/lib/analytics";

// Last view sent from this page load. Guards against React Strict Mode running the
// effect twice in development; a new page load (reload or direct visit) starts fresh,
// and client-side navigation to another advisor changes the key.
let lastSent: { key: string; at: number } | null = null;

/**
 * Sends catalog_view or advisor_view once per view, on direct loads and on client-side
 * navigation alike (the effect runs whenever the page mounts or the slug changes).
 */
export function TrackView({
  event,
  catalogMode,
  advisorSlug,
}: {
  event: "catalog_view" | "advisor_view";
  catalogMode: CatalogMode;
  advisorSlug?: string;
}) {
  useEffect(() => {
    const key = `${event}:${advisorSlug ?? ""}:${window.location.pathname}`;
    const now = Date.now();
    if (lastSent && lastSent.key === key && now - lastSent.at < 1000) return;
    lastSent = { key, at: now };
    track(event, { catalog_mode: catalogMode, advisor_slug: advisorSlug });
  }, [event, catalogMode, advisorSlug]);

  return null;
}
