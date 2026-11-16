import type { getGsap } from "@/lib/motion/gsap";

/* ============================================================
   SECTION NAVIGATION THAT LANDS ON REVEALED CONTENT

   Normal scrolling keeps every scrubbed / pinned reveal. A click on an
   in-page link (header, footer, CTAs, cards), a direct hash URL, or
   back/forward between hashes instead jumps to the scroll position where
   the destination section is already fully revealed, then finishes every
   scrub catch-up tween at once. Nothing is disabled; the page is simply
   placed at the end of the destination's reveal.
============================================================ */

// How far into a pinned section's timeline its content is fully revealed.
const PINNED_REVEAL_PROGRESS: Record<string, number> = {
  insights: 1,
  challenges: 1,
  "final-cta": 1,
};

// Space kept above an in-section anchor when navigation lands on it.
const ANCHOR_TOP_MARGIN = 64;

/**
 * Rendered offset of `element` below the top of `ancestor`. Rendered boxes include the
 * static centring transforms of the design frames; the reveal timelines move in-section
 * anchors such as #brokers only horizontally, so the vertical offset is stable.
 */
function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
  return element.getBoundingClientRect().top - ancestor.getBoundingClientRect().top;
}

export function setupSectionNavigation(
  ScrollTrigger: ReturnType<typeof getGsap>["ScrollTrigger"],
) {
  const sectionOf = (element: HTMLElement) =>
    element.closest<HTMLElement>("section[data-px], footer[data-px]") ?? element;

  const destinationFor = (element: HTMLElement) => {
    if (element.id === "top") {
      return 0;
    }

    const section = sectionOf(element);
    const pinned = ScrollTrigger.getAll().find(
      (trigger) =>
        Boolean(trigger.pin) &&
        trigger.trigger instanceof HTMLElement &&
        (trigger.trigger === section || trigger.trigger.contains(element)),
    );

    if (pinned) {
      const progress = PINNED_REVEAL_PROGRESS[section.dataset.px ?? ""] ?? 1;
      const position = pinned.start + (pinned.end - pinned.start) * progress;
      // Stay one pixel inside the pin so the section is still pinned in view.
      const revealed = Math.max(pinned.start, Math.round(position) - 1);
      if (element === section || progress < 1) {
        return revealed;
      }
      // An anchor inside a pinned section that is taller than its first screen (such as
      // #brokers inside Our Testing): let the pin finish fully revealed, then keep
      // scrolling until the anchor itself sits near the top of the viewport.
      const below = offsetWithin(element, section) - ANCHOR_TOP_MARGIN;
      return below > 0 ? Math.round(pinned.end + below) : revealed;
    }

    return Math.max(0, Math.round(element.getBoundingClientRect().top + window.scrollY));
  };

  const settleAnimations = () => {
    ScrollTrigger.update();
    ScrollTrigger.getAll().forEach((trigger) => {
      // Scrubbed timelines: skip the smoothing lag and land on the scroll position.
      const scrubTween = trigger.getTween?.();
      if (scrubTween) {
        scrubTween.progress(1);
        return;
      }
      // Play-on-enter animations (smaller screens): finish them if already entered.
      if (!trigger.vars.scrub && trigger.animation && trigger.progress > 0) {
        trigger.animation.progress(1);
      }
    });
  };

  // Delayed landings of the latest navigation only. A newer navigation or cleanup cancels
  // them, and every callback also checks the generation and disposal, because a callback
  // the browser has already queued can still run after its handle is cancelled.
  let generation = 0;
  let disposed = false;
  const pendingFrames = new Set<number>();
  const pendingTimers = new Set<number>();

  const cancelPending = () => {
    pendingFrames.forEach((frame) => cancelAnimationFrame(frame));
    pendingTimers.forEach((timer) => window.clearTimeout(timer));
    pendingFrames.clear();
    pendingTimers.clear();
  };

  const goTo = (hash: string, options: { updateHistory: boolean }) => {
    if (disposed) {
      return false;
    }
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    const element = id ? document.getElementById(id) : null;
    if (!element) {
      return false;
    }

    // Push the new entry BEFORE scrolling: the browser saves the scroll position of the entry
    // being left when it is pushed, and restores it on back/forward. Pushing after the jump
    // saved the destination's position for the previous entry, so Back returned there.
    if (options.updateHistory && window.location.hash !== `#${id}`) {
      history.pushState(null, "", `#${id}`);
    }

    cancelPending();
    const current = ++generation;
    const land = () => {
      if (disposed || current !== generation) {
        return;
      }
      window.scrollTo({ top: destinationFor(element), behavior: "instant" });
      settleAnimations();
    };
    land();
    // A second pass after layout settles (pins and spacers can shift by a frame).
    const frame = requestAnimationFrame(() => {
      pendingFrames.delete(frame);
      land();
    });
    pendingFrames.add(frame);
    if (!options.updateHistory) {
      // Back/forward: the browser restores the entry's saved scroll position after
      // popstate; land again afterwards so a layout change since then (an expanded FAQ
      // answer, a resize) cannot leave the page at a stale position.
      const timer = window.setTimeout(() => {
        pendingTimers.delete(timer);
        land();
      }, 0);
      pendingTimers.add(timer);
    }

    // Move focus for keyboard and screen-reader users without scrolling again.
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "-1");
    }
    element.focus({ preventScroll: true });
    return true;
  };

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const link = (event.target as Element | null)?.closest?.("a[href^='#']");
    const href = link?.getAttribute("href");
    if (!href || href.length < 2) {
      return;
    }
    if (goTo(href, { updateHistory: true })) {
      event.preventDefault();
    }
  };

  const onPopState = () => {
    if (window.location.hash) {
      goTo(window.location.hash, { updateHistory: false });
    }
  };

  document.addEventListener("click", onClick);
  window.addEventListener("popstate", onPopState);

  return {
    goTo,
    cleanup: () => {
      disposed = true;
      cancelPending();
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
    },
  };
}
