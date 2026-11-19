"use client";

import { useEffect } from "react";

import { track } from "@/lib/analytics";

/**
 * One document-level delegate for links marked with ctaAttributes(). It never cancels
 * the click or waits, so navigation is unchanged. A mouse click, a tap and keyboard
 * activation (Enter) each dispatch one click; middle-click (new tab) is counted via
 * auxclick; a repeat on the same element within 800 ms counts once. Disabled
 * "Coming soon" controls carry no data-analytics-event and are never counted.
 */
export function AnalyticsClicks() {
  useEffect(() => {
    const last = new WeakMap<Element, number>();

    const fire = (target: EventTarget | null) => {
      const el = target instanceof Element ? target.closest("[data-analytics-event]") : null;
      if (!el || el.getAttribute("aria-disabled") === "true") return;
      const now = Date.now();
      if (now - (last.get(el) ?? 0) < 800) return;
      last.set(el, now);
      track(el.getAttribute("data-analytics-event") ?? "", {
        cta_placement: el.getAttribute("data-analytics-placement") ?? undefined,
        destination: el.getAttribute("data-analytics-destination") ?? undefined,
        advisor_slug: el.getAttribute("data-analytics-advisor-slug") ?? undefined,
      });
    };

    const onClick = (event: MouseEvent) => fire(event.target);
    const onAuxClick = (event: MouseEvent) => {
      if (event.button === 1) fire(event.target);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("auxclick", onAuxClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("auxclick", onAuxClick);
    };
  }, []);

  return null;
}
