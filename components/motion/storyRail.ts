import type { getGsap } from "@/lib/motion/gsap";

/*
  Chapter indicator ("04 / 07 — No Upfront Price") on the right edge of the homepage.

  Kept in its own module without JSX and with type-only imports, so the lifecycle can be
  checked in Node (tests/motion/story-rail.test.mjs) with the real function.

  setupStoryRail() returns a cleanup. GSAP's context.revert() reverts the tweens created
  here, but not the window scroll/resize listeners, the ScrollTrigger "refresh" listener or
  a queued animation frame, which are registered manually. The cleanup removes all three
  listeners by their original references, cancels the pending frame and marks the rail as
  disposed, so a callback that is already queued never updates detached elements.
*/

type Gsap = ReturnType<typeof getGsap>["gsap"];
type ScrollTriggerStatic = ReturnType<typeof getGsap>["ScrollTrigger"];

const CHAPTERS = [
  ["[data-px='hero']", "Welcome"],
  ["[data-px='insights']", "Our Testing"],
  ["[data-px='challenges']", "How It Works"],
  ["[data-px='roles']", "No Upfront Price"],
  ["[data-px='learning']", "FAQ"],
  ["[data-px='final-cta']", "Get Access"],
  ["[data-px='footer']", "ForexLAB Access"],
] as const;

const noop = () => {};

export function setupStoryRail(gsap: Gsap, ScrollTrigger: ScrollTriggerStatic): () => void {
  const select = <T extends Element>(selector: string) => document.querySelector<T>(selector);

  const rail = select<HTMLElement>("[data-motion-story-progress]");
  const fill = select<HTMLElement>("[data-motion-story-progress-fill]");
  const index = select<HTMLElement>("[data-motion-story-index]");
  const label = select<HTMLElement>("[data-motion-story-label]");

  if (!rail || !fill || !index || !label) {
    return noop;
  }

  const setChapter = (chapter: number) => {
    index.textContent = `${String(chapter + 1).padStart(2, "0")} / 07`;
    label.textContent = CHAPTERS[chapter][1];
    gsap.fromTo(
      [index, label],
      { autoAlpha: 0, x: 8 },
      { autoAlpha: 1, x: 0, duration: 0.28, ease: "power3.out" },
    );
  };

  gsap.to(rail, { autoAlpha: 1, duration: 0.5, delay: 2.25 });
  gsap.set(fill, { scaleY: 0, transformOrigin: "top center" });
  gsap.to(fill, {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      start: 0,
      end: "max",
      scrub: 0.3,
    },
  });

  /*
    The active chapter is computed from the current layout and scroll position, not from
    onEnter/onEnterBack callbacks or stored trigger positions. Below 1024px the pinned
    sections' desktop triggers are reverted (no pin spacing) and gsap.matchMedia recreates
    them when the viewport widens again, so positions remembered or callbacks fired around
    those refreshes went stale ("07 / 07" at #advisors after a 1280 -> 380 -> 1280 resize).

    A chapter is active once its top has passed the viewport centre (the former
    "top center" start). A pinned section is measured by its pin-spacer, which covers the
    whole pinned scroll distance. sync() runs once per frame while scrolling, after every
    ScrollTrigger refresh (resize, breakpoint change, FAQ static layout, section
    navigation) and on resize, and only updates the text when the chapter changes.
  */
  const sections = CHAPTERS.map(([selector]) => select<HTMLElement>(selector));
  let current = -1;
  let frame = 0;
  let disposed = false;

  const layoutBox = (element: HTMLElement) => {
    const parent = element.parentElement;
    return parent?.classList.contains("pin-spacer") ? parent : element;
  };

  const activeChapter = () => {
    const centre = window.innerHeight / 2;
    let active = 0;
    sections.forEach((element, chapter) => {
      if (element && layoutBox(element).getBoundingClientRect().top <= centre) {
        active = chapter;
      }
    });
    return active;
  };

  const sync = () => {
    frame = 0;
    if (disposed) {
      return;
    }
    const chapter = activeChapter();
    if (chapter !== current) {
      current = chapter;
      setChapter(chapter);
    }
  };

  const queueSync = () => {
    if (!frame && !disposed) {
      frame = requestAnimationFrame(sync);
    }
  };

  window.addEventListener("scroll", queueSync, { passive: true });
  window.addEventListener("resize", queueSync);
  ScrollTrigger.addEventListener("refresh", sync);
  sync();

  return () => {
    if (disposed) {
      return;
    }
    disposed = true;
    window.removeEventListener("scroll", queueSync);
    window.removeEventListener("resize", queueSync);
    ScrollTrigger.removeEventListener("refresh", sync);
    if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
