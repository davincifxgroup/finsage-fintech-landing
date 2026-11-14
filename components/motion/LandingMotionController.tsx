"use client";

import { useLayoutEffect } from "react";

import { getGsap } from "@/lib/motion/gsap";
import { readMotionMode } from "@/lib/motion/motion-mode";
import { asset } from "@/lib/site";

const select = <T extends Element>(selector: string) =>
  document.querySelector<T>(selector);

const selectAll = <T extends Element>(selector: string) =>
  Array.from(document.querySelectorAll<T>(selector));

function setupOpeningSequence(
  gsap: ReturnType<typeof getGsap>["gsap"],
  releaseScroll: () => void,
) {
  const loader = select<HTMLElement>("[data-motion-loader]");
  const loaderLogo = select<HTMLElement>("[data-motion-loader-logo]");
  const loaderFilled = select<HTMLElement>("[data-motion-loader-filled]");
  const loaderOutline = select<HTMLElement>("[data-motion-loader-outline]");
  const loaderWordMask = select<HTMLElement>("[data-motion-loader-word-mask]");
  const loaderWord = select<HTMLElement>("[data-motion-loader-word]");

  const background = select<HTMLElement>("[data-px='hero.background']");
  const ticker = select<HTMLElement>("[data-px='hero.ticker']");
  const brand = select<HTMLElement>("[data-px='hero.brand']");
  const navigation = select<HTMLElement>("[data-px='hero.nav']");
  const artwork = select<HTMLElement>("[data-px='hero.artwork']");
  const rings = selectAll<HTMLElement>(".hero-artwork-circle");
  const eyebrow = select<HTMLElement>("[data-px='hero.eyebrow']");
  const title = select<HTMLElement>("[data-px='hero.title']");
  const input = select<HTMLElement>("[data-px='hero.prompt.input']");
  const button = select<HTMLElement>("[data-px='hero.prompt.submit']");

  if (
    !loader ||
    !loaderLogo ||
    !loaderFilled ||
    !loaderOutline ||
    !loaderWordMask ||
    !loaderWord ||
    !background ||
    !ticker ||
    !brand ||
    !navigation ||
    !artwork ||
    !eyebrow ||
    !title ||
    !input ||
    !button ||
    rings.length === 0
  ) {
    loader?.remove();
    releaseScroll();
    return;
  }

  gsap.set(background, { autoAlpha: 0 });
  gsap.set(ticker, { autoAlpha: 0, yPercent: -100 });
  gsap.set([brand, navigation], { autoAlpha: 0 });
  gsap.set(rings, { autoAlpha: 0, scale: 1.36 });
  gsap.set([eyebrow, title, input, button], { autoAlpha: 0, y: 8 });

  gsap.set(loaderFilled, {
    scale: 0.06,
    transformOrigin: "50% 50%",
  });
  gsap.set(loaderOutline, {
    autoAlpha: 0,
    scale: 0.72,
    x: -11,
    transformOrigin: "50% 50%",
  });
  gsap.set(loaderWordMask, { clipPath: "inset(0 100% 0 0)" });
  gsap.set(loaderWord, { x: -5 });

  const loaderRect = loaderLogo.getBoundingClientRect();
  const brandRect = (brand.querySelector("img") ?? brand).getBoundingClientRect();
  const logoScale = brandRect.height / loaderRect.height;
  const logoX = brandRect.left - loaderRect.left;
  const logoY = brandRect.top - loaderRect.top;

  const finalHeroTargets = [
    background,
    ticker,
    brand,
    navigation,
    ...rings,
    eyebrow,
    title,
    input,
    button,
  ];

  const timeline = gsap.timeline({
    defaults: { ease: "power3.inOut" },
    onComplete: () => {
      gsap.set(finalHeroTargets, {
        clearProps: "opacity,visibility,transform",
      });
      releaseScroll();
    },
  });

  timeline
    .to(loaderFilled, {
      scale: 1,
      duration: 0.3,
      ease: "power3.inOut",
    })
    .to(loaderFilled, {
      scaleX: 1.16,
      scaleY: 0.76,
      duration: 0.18,
      ease: "power2.inOut",
    })
    .to(loaderFilled, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.22,
      ease: "power2.inOut",
    })
    .to(
      loaderOutline,
      {
        autoAlpha: 1,
        scale: 1,
        x: 0,
        duration: 0.26,
        ease: "power3.out",
      },
      "-=0.14",
    )
    .to(
      loaderWordMask,
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.3,
        ease: "power3.out",
      },
      "+=0.06",
    )
    .to(loaderWord, { x: 0, duration: 0.3, ease: "power3.out" }, "<")
    .to(loaderLogo, { duration: 0.25 })
    .to(
      background,
      { autoAlpha: 1, duration: 0.34, ease: "power2.inOut" },
      ">",
    )
    .to(
      loader,
      {
        backgroundColor: "rgba(255,255,255,0)",
        duration: 0.34,
        ease: "power2.inOut",
      },
      "<",
    )
    .to(
      ticker,
      { autoAlpha: 1, yPercent: 0, duration: 0.25, ease: "power3.out" },
      "-=0.2",
    )
    .to(loaderLogo, {
      x: logoX,
      y: logoY,
      scale: logoScale,
      transformOrigin: "top left",
      duration: 0.42,
      ease: "power3.inOut",
    })
    .set(brand, { autoAlpha: 1 })
    .set(loaderLogo, { autoAlpha: 0 }, "<")
    .set(loader, { display: "none" })
    .to(
      rings,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.045,
        ease: "power3.out",
      },
      "-=0.08",
    )
    .to(
      navigation,
      { autoAlpha: 1, duration: 0.25, ease: "power3.out" },
      "-=0.32",
    )
    .to(
      eyebrow,
      { autoAlpha: 1, y: 0, duration: 0.28, ease: "power3.out" },
      "-=0.2",
    )
    .to(
      title,
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" },
      "-=0.15",
    )
    .to(
      input,
      { autoAlpha: 1, y: 0, duration: 0.28, ease: "power3.out" },
      "-=0.18",
    )
    .to(
      button,
      { autoAlpha: 1, y: 0, duration: 0.26, ease: "power3.out" },
      "-=0.18",
    );
}

function setupStoryRail(
  gsap: ReturnType<typeof getGsap>["gsap"],
  ScrollTrigger: ReturnType<typeof getGsap>["ScrollTrigger"],
) {
  const rail = select<HTMLElement>("[data-motion-story-progress]");
  const fill = select<HTMLElement>("[data-motion-story-progress-fill]");
  const index = select<HTMLElement>("[data-motion-story-index]");
  const label = select<HTMLElement>("[data-motion-story-label]");

  if (!rail || !fill || !index || !label) {
    return;
  }

  const chapters = [
    ["[data-px='hero']", "Welcome"],
    ["[data-px='insights']", "Our Testing"],
    ["[data-px='challenges']", "How It Works"],
    ["[data-px='roles']", "No Upfront Price"],
    ["[data-px='learning']", "FAQ"],
    ["[data-px='final-cta']", "Get Access"],
    ["[data-px='footer']", "ForexLAB Access"],
  ] as const;

  const setChapter = (chapter: number) => {
    index.textContent = `${String(chapter + 1).padStart(2, "0")} / 07`;
    label.textContent = chapters[chapter][1];
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
  const sections = chapters.map(([selector]) => select<HTMLElement>(selector));
  let current = -1;
  let frame = 0;

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
    const chapter = activeChapter();
    if (chapter !== current) {
      current = chapter;
      setChapter(chapter);
    }
  };

  const queueSync = () => {
    if (!frame) {
      frame = requestAnimationFrame(sync);
    }
  };

  window.addEventListener("scroll", queueSync, { passive: true });
  window.addEventListener("resize", queueSync);
  ScrollTrigger.addEventListener("refresh", sync);
  sync();
}

function setupHeroDeparture(
  gsap: ReturnType<typeof getGsap>["gsap"],
  matchMedia: ReturnType<ReturnType<typeof getGsap>["gsap"]["matchMedia"]>,
) {
  matchMedia.add("(min-width: 768px)", () => {
    const hero = select<HTMLElement>("[data-px='hero']");
    const background = select<HTMLElement>("[data-px='hero.background']");
    const header = select<HTMLElement>("[data-px='hero.header']");
    const artwork = select<HTMLElement>("[data-px='hero.artwork']");
    const rings = selectAll<HTMLElement>(".hero-artwork-circle");
    const eyebrow = select<HTMLElement>("[data-px='hero.eyebrow']");
    const title = select<HTMLElement>("[data-px='hero.title']");
    const prompt = select<HTMLElement>("[data-px='hero.prompt']");

    if (
      !hero ||
      !background ||
      !header ||
      !artwork ||
      !eyebrow ||
      !title ||
      !prompt
    ) {
      return;
    }

    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      })
      .to(background, { yPercent: 8, scale: 1.08 }, 0)
      .to(header, { y: -34, autoAlpha: 0.25 }, 0)
      .to(artwork, { yPercent: -34, scale: 1.18 }, 0)
      .to(
        rings,
        {
          rotation: (ringIndex) => (ringIndex - 2) * 22,
          x: (ringIndex) => (ringIndex - 2) * 15,
          scale: 1.35,
          stagger: 0.025,
        },
        0,
      )
      .to(eyebrow, { x: 24, autoAlpha: 0 }, 0.08)
      .to(title, { y: -70, autoAlpha: 0.08, scale: 0.96 }, 0.04)
      .to(prompt, { y: 92, autoAlpha: 0 }, 0.08);

    // This timeline is created while the opening sequence still has its temporary
    // inline styles on these elements (hidden, offset, translate(-50%) from the Tailwind
    // centring). When the query stops matching (resizing or rotating below 768px),
    // GSAP restores the styles it recorded then, which would leave the mobile hero
    // shifted or hidden (the clipped heading). Clear them so the stylesheet layout applies.
    return () => {
      gsap.set([background, header, artwork, ...rings, eyebrow, title, prompt], {
        clearProps: "transform,opacity,visibility",
      });
    };
  });
}

function setupInsightsProgress(
  gsap: ReturnType<typeof getGsap>["gsap"],
  matchMedia: ReturnType<ReturnType<typeof getGsap>["gsap"]["matchMedia"]>,
) {
  const section = select<HTMLElement>("[data-px='insights']");
  const header = select<HTMLElement>("[data-px='insights.header']");
  const tabs = select<HTMLElement>("[data-px='insights.tabs']");
  const tabItems = selectAll<HTMLElement>("[data-px^='insights.tab.']");
  const copy = select<HTMLElement>("[data-px='insights.copy']");
  const process = select<HTMLElement>("[data-px='insights.process']");
  const cards = selectAll<HTMLElement>(
    "[data-px^='insights.pipeline.'][data-px$='.card']",
  );
  const rails = selectAll<HTMLElement>("[data-motion^='insights-rail-']");
  const nodes = selectAll<HTMLElement>("[data-motion^='insights-node-']");

  if (
    !section ||
    !header ||
    !tabs ||
    !copy ||
    !process ||
    rails.length !== 2 ||
    nodes.length !== 3
  ) {
    return;
  }

  gsap.set(rails, {
    autoAlpha: 1,
    scaleY: 0,
    transformOrigin: "top center",
  });
  gsap.set(nodes[0], { backgroundColor: "#000000", borderColor: "#000000" });
  gsap.set(nodes.slice(1), {
    backgroundColor: "#e8e8e8",
    borderColor: "#dedede",
  });

  matchMedia.add("(min-width: 1024px)", () => {
    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=160%",
        pin: true,
        scrub: 0.75,
        anticipatePin: 1,
      },
    });

    timeline
      .from(header, { autoAlpha: 0, y: -36, duration: 0.16 })
      .from(
        tabItems,
        { autoAlpha: 0, y: 18, stagger: 0.025, duration: 0.13 },
        0.06,
      )
      .from(copy, { autoAlpha: 0, x: -86, duration: 0.24 }, 0.12)
      .from(
        process,
        {
          autoAlpha: 0,
          clipPath: "inset(8% 10% 8% 10% round 28px)",
          scale: 0.92,
          duration: 0.28,
        },
        0.12,
      )
      .from(
        cards,
        { autoAlpha: 0.14, x: 44, stagger: 0.04, duration: 0.18 },
        0.25,
      )
      .to(rails[0], { scaleY: 1, duration: 0.22 }, 0.39)
      .to(
        nodes[1],
        {
          backgroundColor: "#000000",
          borderColor: "#000000",
          scale: 1.2,
          duration: 0.08,
        },
        0.55,
      )
      .to(nodes[1], { scale: 1, duration: 0.06 }, 0.63)
      .to(rails[1], { scaleY: 1, duration: 0.22 }, 0.65)
      .to(
        nodes[2],
        {
          backgroundColor: "#000000",
          borderColor: "#000000",
          scale: 1.2,
          duration: 0.08,
        },
        0.82,
      )
      .to(nodes[2], { scale: 1, duration: 0.06 }, 0.9)
      .to(process, { scale: 1.025, duration: 0.1 }, 0.89)
      .to(process, { scale: 1, duration: 0.1 }, 0.99);
  });

  matchMedia.add("(max-width: 1023px)", () => {
    gsap
      .timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: process,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      })
      .to(rails[0], { scaleY: 1, duration: 0.5 }, 0.15)
      .to(
        nodes[1],
        {
          backgroundColor: "#000000",
          borderColor: "#000000",
          duration: 0.18,
        },
        0.6,
      )
      .to(rails[1], { scaleY: 1, duration: 0.55 }, 0.9)
      .to(
        nodes[2],
        {
          backgroundColor: "#000000",
          borderColor: "#000000",
          duration: 0.2,
        },
        1.5,
      );
  });
}

function setupTerminalReveal(
  gsap: ReturnType<typeof getGsap>["gsap"],
  matchMedia: ReturnType<ReturnType<typeof getGsap>["gsap"]["matchMedia"]>,
) {
  const section = select<HTMLElement>("[data-px='challenges']");
  const intro = select<HTMLElement>("[data-px='challenges.intro']");
  const tabs = selectAll<HTMLElement>("[data-px^='challenges.tab.']");
  const terminal = select<HTMLElement>("[data-px='challenges.terminal']");
  const terminalHeader = select<HTMLElement>(
    "[data-px='challenges.terminal.header']",
  );
  const question = select<HTMLElement>(
    "[data-px='challenges.terminal.question']",
  );
  const lines = selectAll<HTMLElement>("[data-motion='challenge-code-line']");
  const mutedGroup = select<HTMLElement>("[data-motion='challenge-code-muted']");

  if (
    !section ||
    !intro ||
    !terminal ||
    !terminalHeader ||
    !question ||
    lines.length < 3
  ) {
    return;
  }

  gsap.set(lines.slice(2), { autoAlpha: 0.08, y: 3 });
  // Dimmed only when motion runs; readable by default (reduced motion, no JS).
  if (mutedGroup) {
    gsap.set(mutedGroup, { opacity: 0.16 });
  }

  matchMedia.add("(min-width: 1024px)", () => {
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 0.72,
        anticipatePin: 1,
      },
    });

    timeline
      .from(intro, { autoAlpha: 0, x: -72, duration: 0.16 })
      .from(
        tabs,
        { autoAlpha: 0, y: 24, stagger: 0.035, duration: 0.13 },
        0.08,
      )
      .from(
        terminal,
        {
          autoAlpha: 0,
          scale: 0.87,
          rotationX: 7,
          transformPerspective: 900,
          duration: 0.24,
        },
        0.16,
      )
      .from(terminalHeader, { yPercent: -100, duration: 0.16 }, 0.27)
      .from(question, { autoAlpha: 0, x: -36, duration: 0.12 }, 0.35)
      .to(
        lines.slice(2),
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.055,
          stagger: 0.045,
        },
        0.42,
      );

    if (mutedGroup) {
      timeline.to(mutedGroup, { opacity: 1, duration: 0.15 }, 0.7);
    }

    timeline
      .to(
        terminal,
        {
          boxShadow: "0 34px 90px rgba(30, 52, 120, 0.22)",
          scale: 1.015,
          duration: 0.11,
        },
        0.86,
      )
      .to(terminal, { scale: 1, duration: 0.09 }, 0.97);
  });

  matchMedia.add("(max-width: 1023px)", () => {
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: terminal,
        start: "top 72%",
        toggleActions: "play none none reverse",
      },
    });

    timeline.to(lines.slice(2), {
      autoAlpha: 1,
      y: 0,
      duration: 0.2,
      stagger: 0.11,
    });

    if (mutedGroup) {
      timeline.to(mutedGroup, { opacity: 1, duration: 0.35 }, "-=0.65");
    }
  });
}

function setupRolesNarrative(
  gsap: ReturnType<typeof getGsap>["gsap"],
  matchMedia: ReturnType<ReturnType<typeof getGsap>["gsap"]["matchMedia"]>,
) {
  const section = select<HTMLElement>("[data-px='roles']");
  const label = select<HTMLElement>("[data-px='roles.label']");
  const header = select<HTMLElement>("[data-px='roles.header']");
  const cards = selectAll<HTMLElement>("[data-px^='roles.card.']").filter(
    (element) => /^roles\.card\.\d$/.test(element.dataset.px ?? ""),
  );
  const icons = selectAll<HTMLElement>("[data-px^='roles.card.'][data-px$='.icon']");
  const invest = select<HTMLElement>("[data-px='roles.investgpt']");
  const visual = select<HTMLElement>("[data-px='roles.investgpt.visual']");
  const panel = select<HTMLElement>("[data-px='roles.investgpt.panel']");

  if (!section || !label || !header || !invest || !visual || !panel) {
    return;
  }

  matchMedia.add("(min-width: 1024px)", () => {
    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          end: "top 8%",
          scrub: 0.65,
        },
      })
      .from(label, { autoAlpha: 0, y: 24, duration: 0.15 })
      .from(header, { autoAlpha: 0, y: 54, duration: 0.24 }, 0.08)
      .from(
        cards,
        {
          autoAlpha: 0,
          y: 78,
          scale: 0.92,
          stagger: 0.08,
          duration: 0.25,
        },
        0.3,
      )
      .from(
        icons,
        {
          autoAlpha: 0,
          scale: 0.6,
          stagger: 0.08,
          duration: 0.22,
        },
        0.38,
      );

    gsap
      .timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: invest,
          start: "top 88%",
          end: "top 22%",
          scrub: 0.75,
        },
      })
      .from(visual, {
        clipPath: "inset(0 100% 0 0)",
        scale: 0.92,
        duration: 0.6,
      })
      .from(
        panel,
        { clipPath: "inset(0 0 0 100%)", x: 54, duration: 0.6 },
        0.08,
      );

    // The label and header are centred with Tailwind's lg:-translate-x-1/2 (the CSS
    // `translate` property). GSAP folds that into an inline transform (translate(-50%))
    // with `translate: none`, and reverting this context below 1024px left them there,
    // so the mobile eyebrow and heading were shifted left and clipped until a reload.
    // Clear what this context animated so the stylesheet layout applies again.
    return () => {
      gsap.set([label, header, ...cards, ...icons, visual, panel], {
        clearProps: "transform,translate,opacity,visibility,clipPath",
      });
    };
  });

  matchMedia.add("(max-width: 1023px)", () => {
    gsap.from(cards, {
      autoAlpha: 0,
      y: 44,
      stagger: 0.1,
      duration: 0.55,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cards[0] ?? section,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

function setupInvestGptScroll(
  gsap: ReturnType<typeof getGsap>["gsap"],
  matchMedia: ReturnType<ReturnType<typeof getGsap>["gsap"]["matchMedia"]>,
) {
  matchMedia.add("(min-width: 1024px)", () => {
    const visual = select<HTMLElement>("[data-px='roles.investgpt.visual']");
    const symbol = select<HTMLElement>("[data-motion='investgpt-symbol']");
    const glow = select<HTMLElement>("[data-motion='investgpt-glow']");

    if (!visual || !symbol || !glow) {
      return;
    }

    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: visual,
          start: "top 90%",
          end: "bottom 15%",
          scrub: 0.65,
        },
      })
      .to(symbol, { scale: 1.06, transformOrigin: "50% 50%" }, 0)
      .to(
        glow,
        { rotation: -80, scale: 1.02, transformOrigin: "50% 50%" },
        0,
      );
  });
}

function setupLearningScrollytelling(
  gsap: ReturnType<typeof getGsap>["gsap"],
  matchMedia: ReturnType<ReturnType<typeof getGsap>["gsap"]["matchMedia"]>,
) {
  const section = select<HTMLElement>("[data-px='learning']");
  const label = select<HTMLElement>("[data-px='learning.label']");
  const header = select<HTMLElement>("[data-px='learning.header']");
  const carousel = select<HTMLElement>("[data-px='learning.carousel']");
  const track = select<HTMLElement>("[data-px='learning.track']");
  const cards = selectAll<HTMLElement>("[data-px^='learning.card.']").filter(
    (element) => /^learning\.card\.\d$/.test(element.dataset.px ?? ""),
  );
  const figures = selectAll<HTMLElement>(
    "[data-px^='learning.card.'][data-px$='.figure']",
  );

  if (!section || !label || !header || !carousel || !track || cards.length < 2) {
    return;
  }

  matchMedia.add("(min-width: 1024px)", () => {
    const travel = () => Math.max(0, track.scrollWidth - carousel.clientWidth + 28);

    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: FAQ_RAIL_TRIGGER_ID,
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 1.8, travel() * 5)}`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      .from(label, { autoAlpha: 0, x: -42, duration: 0.08, ease: "power3.out" })
      .from(
        header,
        { autoAlpha: 0, y: 62, duration: 0.14, ease: "power3.out" },
        0.04,
      )
      .from(
        cards,
        {
          autoAlpha: 0,
          y: (cardIndex) => 90 + cardIndex * 22,
          rotation: (cardIndex) => (cardIndex % 2 === 0 ? -2 : 2),
          stagger: 0.045,
          duration: 0.18,
          ease: "power3.out",
        },
        0.12,
      )
      .to(track, { x: () => -travel(), duration: 0.5 }, 0.44)
      .to(
        figures,
        {
          rotation: (figureIndex) => (figureIndex % 2 === 0 ? -4 : 4),
          transformOrigin: "50% 50%",
          duration: 0.5,
        },
        0.44,
      )
      .to(figures, { rotation: 0, duration: 0.08 }, 0.94);
  });

  matchMedia.add("(max-width: 1023px)", () => {
    gsap.from(cards, {
      autoAlpha: 0,
      y: 52,
      stagger: 0.09,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: carousel,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

function setupGlobalControlHovers(
  gsap: ReturnType<typeof getGsap>["gsap"],
  matchMedia: ReturnType<ReturnType<typeof getGsap>["gsap"]["matchMedia"]>,
) {
  matchMedia.add("(hover: hover) and (pointer: fine)", () => {
    const cleanups: Array<() => void> = [];
    const featured = selectAll<HTMLElement>(
      "[data-px='hero.prompt.submit'], [data-px='final-cta.button']",
    );
    const tabs = selectAll<HTMLElement>(
      "[data-px^='insights.tab.'], [data-px^='challenges.tab.']",
    ).filter((element) => element.matches("a, button"));
    const claimed = new Set<HTMLElement>([...featured, ...tabs]);
    const quietControls = selectAll<HTMLElement>("a, button").filter(
      (element) =>
        !claimed.has(element) && !element.closest("[data-px='learning']"),
    );

    const bind = (
      element: HTMLElement,
      enterVars: gsap.TweenVars,
      leaveVars: gsap.TweenVars,
    ) => {
      const enter = () => {
        gsap.killTweensOf(element);
        gsap.set(element, { willChange: "transform" });
        gsap.to(element, {
          ...enterVars,
          overwrite: "auto",
        });
      };
      const leave = () => {
        gsap.killTweensOf(element);
        gsap.to(element, {
          ...leaveVars,
          overwrite: "auto",
          onComplete: () => gsap.set(element, { clearProps: "willChange" }),
        });
      };
      const press = () => {
        gsap.to(element, {
          scale: 0.96,
          duration: 0.12,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      element.addEventListener("pointerenter", enter);
      element.addEventListener("pointerleave", leave);
      element.addEventListener("pointerdown", press);
      element.addEventListener("pointerup", enter);

      cleanups.push(() => {
        element.removeEventListener("pointerenter", enter);
        element.removeEventListener("pointerleave", leave);
        element.removeEventListener("pointerdown", press);
        element.removeEventListener("pointerup", enter);
        gsap.killTweensOf(element);
      });
    };

    featured.forEach((element) =>
      bind(
        element,
        {
          y: -3,
          scale: 1.045,
          boxShadow: "0 16px 34px rgba(0,0,0,0.22)",
          duration: 0.28,
          ease: "power3.out",
        },
        {
          y: 0,
          scale: 1,
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          duration: 0.32,
          ease: "power3.out",
        },
      ),
    );

    tabs.forEach((element) =>
      bind(
        element,
        { y: -3, scale: 1.07, duration: 0.22, ease: "power3.out" },
        { y: 0, scale: 1, duration: 0.26, ease: "power3.out" },
      ),
    );

    quietControls.forEach((element) =>
      bind(
        element,
        { x: 4, autoAlpha: 0.68, duration: 0.22, ease: "power3.out" },
        { x: 0, autoAlpha: 1, scale: 1, duration: 0.28, ease: "power3.out" },
      ),
    );

    return () => cleanups.forEach((cleanup) => cleanup());
  });
}

type MotionPrimitive = SVGGeometryElement | HTMLElement;

function prepareStroke(
  gsap: ReturnType<typeof getGsap>["gsap"],
  element: SVGGeometryElement,
) {
  const length = element.getTotalLength();
  gsap.set(element, {
    strokeDasharray: length,
    strokeDashoffset: 0,
  });
  return length;
}

function bindHoverTimeline(
  gsap: ReturnType<typeof getGsap>["gsap"],
  card: HTMLElement,
  targets: MotionPrimitive[],
  timeline: gsap.core.Timeline,
) {
  let resetTween: gsap.core.Tween | null = null;

  const reset = () => {
    timeline.pause();
    resetTween?.kill();
    resetTween = gsap.to(targets, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      scaleX: 1,
      strokeDashoffset: 0,
      duration: 0.32,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  };

  const enter = () => {
    resetTween?.kill();
    resetTween = null;
    timeline.restart();
  };

  card.addEventListener("pointerenter", enter);
  card.addEventListener("pointerleave", reset);

  return () => {
    card.removeEventListener("pointerenter", enter);
    card.removeEventListener("pointerleave", reset);
    resetTween?.kill();
    timeline.kill();
    gsap.killTweensOf(targets);
  };
}

function setupLearningInteractions(
  gsap: ReturnType<typeof getGsap>["gsap"],
  matchMedia: ReturnType<ReturnType<typeof getGsap>["gsap"]["matchMedia"]>,
) {
  matchMedia.add("(hover: hover) and (pointer: fine)", () => {
    const cleanups: Array<() => void> = [];

    const learningCards = selectAll<HTMLElement>(
      "[data-px^='learning.card.']",
    ).filter((element) =>
      /^learning\.card\.\d$/.test(element.dataset.px ?? ""),
    );

    learningCards.forEach((card) => {
      const copy = card.querySelector<HTMLElement>("[data-px$='.copy']");
      const figure = card.querySelector<HTMLElement>("[data-px$='.figure']");
      const cta = card.querySelector<HTMLElement>("[data-px$='.cta']");
      const arrow = cta?.querySelector<HTMLElement>("span") ?? null;

      if (!copy || !figure || !cta) {
        return;
      }

      let bounds = card.getBoundingClientRect();
      const figureX = gsap.quickTo(figure, "x", {
        duration: 0.45,
        ease: "power3.out",
      });
      const figureY = gsap.quickTo(figure, "y", {
        duration: 0.45,
        ease: "power3.out",
      });
      const copyX = gsap.quickTo(copy, "x", {
        duration: 0.4,
        ease: "power3.out",
      });

      const enter = () => {
        bounds = card.getBoundingClientRect();
        gsap.set([copy, figure, cta], { willChange: "transform" });
        gsap.to(card, {
          filter: "brightness(1.045) saturate(1.06)",
          duration: 0.34,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(copy, {
          y: -7,
          duration: 0.34,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(figure, {
          scale: 1.035,
          duration: 0.42,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(cta, {
          x: 6,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "auto",
        });
        if (arrow) {
          gsap.to(arrow, {
            x: 6,
            duration: 0.3,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      };

      const move = (event: PointerEvent) => {
        const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
        figureX(normalizedX * 16);
        figureY(normalizedY * 14);
        copyX(normalizedX * -5);
      };

      const leave = () => {
        figureX(0);
        figureY(0);
        copyX(0);
        gsap.to(card, {
          filter: "brightness(1) saturate(1)",
          scale: 1,
          duration: 0.38,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(copy, {
          y: 0,
          duration: 0.38,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => gsap.set(copy, { clearProps: "willChange" }),
        });
        gsap.to(figure, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.42,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => gsap.set(figure, { clearProps: "willChange" }),
        });
        gsap.to(cta, {
          x: 0,
          duration: 0.34,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => gsap.set(cta, { clearProps: "willChange" }),
        });
        if (arrow) {
          gsap.to(arrow, {
            x: 0,
            duration: 0.34,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      };

      const press = () =>
        gsap.to(card, {
          scale: 0.985,
          duration: 0.12,
          ease: "power2.out",
          overwrite: "auto",
        });
      const release = () =>
        gsap.to(card, {
          scale: 1,
          duration: 0.24,
          ease: "power3.out",
          overwrite: "auto",
        });

      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      card.addEventListener("pointerdown", press);
      card.addEventListener("pointerup", release);

      cleanups.push(() => {
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
        card.removeEventListener("pointerdown", press);
        card.removeEventListener("pointerup", release);
        gsap.killTweensOf([card, copy, figure, cta, arrow].filter(Boolean));
      });
    });

    const videoCard = select<HTMLElement>("[data-px='learning.card.1']");
    const videoAxis = select<SVGGeometryElement>("[data-motion='video-axis']");
    const videoCurve = select<SVGGeometryElement>(
      "[data-motion='video-curve']",
    );

    if (videoCard && videoAxis && videoCurve) {
      const axisLength = prepareStroke(gsap, videoAxis);
      const curveLength = prepareStroke(gsap, videoCurve);
      const videoTargets = [videoAxis, videoCurve];
      gsap.set(videoTargets, {
        transformBox: "fill-box",
        transformOrigin: "50% 50%",
      });

      const videoTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut", overwrite: "auto" },
      });

      videoTimeline
        .to(
          videoAxis,
          {
            strokeDashoffset: axisLength * 0.72,
            rotation: -22,
            x: -13,
            y: 14,
            autoAlpha: 0.28,
            duration: 0.56,
          },
          0,
        )
        .to(
          videoCurve,
          {
            strokeDashoffset: curveLength * 0.58,
            rotation: 17,
            x: 18,
            y: -9,
            duration: 0.56,
          },
          0,
        )
        .to(
          videoTargets,
          {
            strokeDashoffset: 0,
            rotation: 0,
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: 0.62,
          },
          0.56,
        );

      cleanups.push(
        bindHoverTimeline(gsap, videoCard, videoTargets, videoTimeline),
      );
    }

    const academyCard = select<HTMLElement>("[data-px='learning.card.2']");
    const academyOuter = select<SVGGeometryElement>(
      "[data-motion='academy-outer']",
    );
    const academyInner = select<SVGGeometryElement>(
      "[data-motion='academy-inner']",
    );
    const academySpokeX = select<SVGGeometryElement>(
      "[data-motion='academy-spoke-x']",
    );
    const academySpokeY = select<SVGGeometryElement>(
      "[data-motion='academy-spoke-y']",
    );

    if (
      academyCard &&
      academyOuter &&
      academyInner &&
      academySpokeX &&
      academySpokeY
    ) {
      const outerLength = prepareStroke(gsap, academyOuter);
      const academyTargets = [
        academyOuter,
        academyInner,
        academySpokeX,
        academySpokeY,
      ];
      gsap.set(academyTargets, {
        transformBox: "fill-box",
        transformOrigin: "50% 50%",
      });

      const academyTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut", overwrite: "auto" },
      });

      academyTimeline
        .to(
          academyOuter,
          {
            strokeDashoffset: outerLength * 0.58,
            rotation: 28,
            x: -9,
            y: -8,
            duration: 0.58,
          },
          0,
        )
        .to(
          academyInner,
          { rotation: -24, x: -10, y: -3, duration: 0.58 },
          0,
        )
        .to(
          academySpokeX,
          { rotation: -38, x: 16, y: -14, autoAlpha: 0.15, duration: 0.58 },
          0,
        )
        .to(
          academySpokeY,
          { rotation: 54, x: -17, y: 10, autoAlpha: 0.18, duration: 0.58 },
          0,
        )
        .to(
          academyTargets,
          {
            strokeDashoffset: 0,
            rotation: 0,
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: 0.66,
          },
          0.58,
        );

      cleanups.push(
        bindHoverTimeline(
          gsap,
          academyCard,
          academyTargets,
          academyTimeline,
        ),
      );
    }

    const lensCard = select<HTMLElement>("[data-px='learning.card.3']");
    const smallCircle = select<SVGGeometryElement>(
      "[data-motion='market-small-circle']",
    );
    const spiral = select<SVGGeometryElement>("[data-motion='market-spiral']");
    const axis = select<SVGGeometryElement>("[data-motion='market-axis']");
    const largeCircle = select<SVGGeometryElement>(
      "[data-motion='market-large-circle']",
    );
    const diagonalTop = select<SVGGeometryElement>(
      "[data-motion='market-diagonal-top']",
    );
    const diagonalBottom = select<SVGGeometryElement>(
      "[data-motion='market-diagonal-bottom']",
    );

    if (
      lensCard &&
      smallCircle &&
      spiral &&
      axis &&
      largeCircle &&
      diagonalTop &&
      diagonalBottom
    ) {
      const smallLength = prepareStroke(gsap, smallCircle);
      const spiralLength = prepareStroke(gsap, spiral);
      const largeLength = prepareStroke(gsap, largeCircle);
      const lensTargets = [
        smallCircle,
        spiral,
        axis,
        largeCircle,
        diagonalTop,
        diagonalBottom,
      ];

      gsap.set(lensTargets, {
        transformBox: "fill-box",
        transformOrigin: "50% 50%",
      });
      gsap.set(axis, { transformOrigin: "100% 50%" });

      const lensTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut", overwrite: "auto" },
      });

      lensTimeline
        .to(
          smallCircle,
          {
            strokeDashoffset: smallLength * 0.66,
            rotation: -35,
            x: -11,
            y: 6,
            duration: 0.64,
          },
          0,
        )
        .to(
          spiral,
          {
            strokeDashoffset: spiralLength * 0.76,
            rotation: 22,
            x: -7,
            y: -5,
            duration: 0.64,
          },
          0,
        )
        .to(axis, { scaleX: 0.12, autoAlpha: 0.3, duration: 0.64 }, 0)
        .to(
          largeCircle,
          {
            strokeDashoffset: largeLength * 0.8,
            rotation: 34,
            x: 18,
            duration: 0.64,
          },
          0,
        )
        .to(
          diagonalTop,
          { rotation: 25, x: 21, y: -12, autoAlpha: 0.24, duration: 0.64 },
          0,
        )
        .to(
          diagonalBottom,
          { rotation: -25, x: 18, y: 14, autoAlpha: 0.24, duration: 0.64 },
          0,
        )
        .to(
          lensTargets,
          {
            strokeDashoffset: 0,
            rotation: 0,
            x: 0,
            y: 0,
            scaleX: 1,
            autoAlpha: 1,
            duration: 0.72,
          },
          0.64,
        );

      cleanups.push(
        bindHoverTimeline(gsap, lensCard, lensTargets, lensTimeline),
      );
    }

    const smartCard = select<HTMLElement>("[data-px='learning.card.4']");
    const smartCircle = select<SVGGeometryElement>(
      "[data-motion='smart-circle']",
    );
    const smartAxis = select<SVGGeometryElement>("[data-motion='smart-axis']");

    if (smartCard && smartCircle && smartAxis) {
      const circleLength = prepareStroke(gsap, smartCircle);
      const axisLength = prepareStroke(gsap, smartAxis);
      const smartTargets = [smartCircle, smartAxis];
      gsap.set(smartTargets, {
        transformBox: "fill-box",
        transformOrigin: "50% 50%",
      });
      gsap.set(smartAxis, { transformOrigin: "100% 50%" });

      const smartTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut", overwrite: "auto" },
      });

      smartTimeline
        .to(
          smartCircle,
          {
            strokeDashoffset: circleLength * 0.7,
            rotation: 105,
            scale: 0.86,
            x: 14,
            y: -8,
            duration: 0.6,
          },
          0,
        )
        .to(
          smartAxis,
          {
            strokeDashoffset: axisLength * 0.82,
            scaleX: 0.14,
            rotation: -16,
            x: -12,
            autoAlpha: 0.22,
            duration: 0.6,
          },
          0,
        )
        .to(
          smartTargets,
          {
            strokeDashoffset: 0,
            rotation: 0,
            scale: 1,
            scaleX: 1,
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: 0.68,
          },
          0.6,
        );

      cleanups.push(
        bindHoverTimeline(gsap, smartCard, smartTargets, smartTimeline),
      );
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  });
}

function setupFinalCtaScrollytelling(
  gsap: ReturnType<typeof getGsap>["gsap"],
  matchMedia: ReturnType<ReturnType<typeof getGsap>["gsap"]["matchMedia"]>,
) {
  const section = select<HTMLElement>("[data-px='final-cta']");
  const panel = select<HTMLElement>("[data-px='final-cta.panel']");
  const blueField = select<HTMLElement>("[data-motion='final-cta-blue-field']");
  const purpleField = select<HTMLElement>(
    "[data-motion='final-cta-purple-field']",
  );
  const title = select<HTMLElement>("[data-px='final-cta.title']");
  const description = select<HTMLElement>("[data-px='final-cta.description']");
  const button = select<HTMLElement>("[data-px='final-cta.button']");

  if (
    !section ||
    !panel ||
    !blueField ||
    !purpleField ||
    !title ||
    !description ||
    !button
  ) {
    return;
  }

  matchMedia.add("(min-width: 1024px)", () => {
    gsap
      .timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=125%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      })
      .from(panel, {
        autoAlpha: 0,
        clipPath: "inset(18% 16% 18% 16% round 44px)",
        scale: 0.7,
        rotation: -1.2,
        duration: 0.34,
      })
      .from(
        blueField,
        { xPercent: -28, scale: 1.35, autoAlpha: 0.25, duration: 0.54 },
        0.12,
      )
      .from(
        purpleField,
        { xPercent: 32, yPercent: 18, scale: 1.45, duration: 0.54 },
        0.12,
      )
      .from(
        title,
        { autoAlpha: 0, y: 82, scale: 0.9, duration: 0.24 },
        0.32,
      )
      .from(description, { autoAlpha: 0, y: 34, duration: 0.18 }, 0.49)
      .from(
        button,
        { autoAlpha: 0, y: 28, scale: 0.72, duration: 0.18 },
        0.62,
      )
      .to(button, { scale: 1.08, duration: 0.08 }, 0.79)
      .to(button, { scale: 1, duration: 0.08 }, 0.87)
      .to(panel, { scale: 1.018, duration: 0.1 }, 0.88)
      .to(panel, { scale: 1, duration: 0.08 }, 0.98);
  });

  matchMedia.add("(max-width: 1023px)", () => {
    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: panel,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      })
      .from(panel, { autoAlpha: 0, scale: 0.9, duration: 0.6 })
      .from(title, { autoAlpha: 0, y: 38, duration: 0.42 }, "-=0.3")
      .from(description, { autoAlpha: 0, y: 20, duration: 0.35 }, "-=0.24")
      .from(button, { autoAlpha: 0, scale: 0.8, duration: 0.3 }, "-=0.2");
  });
}

function setupFooterReveal(
  gsap: ReturnType<typeof getGsap>["gsap"],
) {
  const footer = select<HTMLElement>("[data-px='footer']");
  const logo = select<HTMLElement>("[data-px='footer.logo']");
  const columns = [
    select<HTMLElement>("[data-px='footer.navigation']"),
    select<HTMLElement>("[data-px='footer.tools']"),
    select<HTMLElement>("[data-px='footer.resources']"),
  ].filter((element): element is HTMLElement => element !== null);
  const mobileColumns = selectAll<HTMLElement>(
    "[data-px='footer.navigation.mobile'], [data-px='footer.tools.mobile'], [data-px='footer.resources.mobile']",
  );
  const legal = select<HTMLElement>("[data-px='footer.legal']");
  const wordmark = select<HTMLElement>("[data-px='footer.wordmark']");

  if (!footer || !logo || !legal || !wordmark) {
    return;
  }

  gsap
    .timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: footer,
        start: "top 92%",
        end: "bottom bottom",
        scrub: 0.7,
      },
    })
    .from(logo, { autoAlpha: 0, x: -48, duration: 0.22 })
    .from(
      [...columns, ...mobileColumns],
      { autoAlpha: 0, y: 64, stagger: 0.08, duration: 0.3 },
      0.08,
    )
    .from(legal, { autoAlpha: 0, x: -34, duration: 0.2 }, 0.34)
    .from(
      wordmark,
      {
        autoAlpha: 0,
        yPercent: 72,
        scaleX: 0.82,
        skewX: 5,
        transformOrigin: "left bottom",
        duration: 0.5,
      },
      0.36,
    );
}


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
// The FAQ rail continues with horizontal travel after its cards appear, so
// it lands where every card has appeared and the rail has not moved yet.
const PINNED_REVEAL_PROGRESS: Record<string, number> = {
  insights: 1,
  challenges: 1,
  learning: 0.44,
  "final-cta": 1,
};

const FAQ_RAIL_TRIGGER_ID = "faq-rail";
// Timeline position where every FAQ card is revealed and the rail has not moved.
const FAQ_RAIL_REVEALED_PROGRESS = 0.44;

function setupSectionNavigation(
  ScrollTrigger: ReturnType<typeof getGsap>["ScrollTrigger"],
) {
  const sectionOf = (element: HTMLElement) =>
    element.closest<HTMLElement>("section[data-px], footer[data-px]") ?? element;

  /*
    FAQ static mode. Navigating to the FAQ shows all four cards at once (grid on
    desktop, vertical list on phones; see app/globals.css). The pinned rail is
    disabled with its timeline parked at "all cards revealed, no travel", and its
    pin spacing is removed before positions are measured. The cinematic rail
    comes back once the section is entirely below the viewport (the visitor
    scrolled back up past it) or when navigating to another section, so the
    layout change always happens off screen or as part of a jump.
  */
  const faqSection = select<HTMLElement>("[data-px='learning']");
  const isFaqStatic = () => faqSection?.dataset.faqMode === "static";

  /** Returns true when the layout actually changed. */
  const setFaqStatic = (staticMode: boolean) => {
    if (!faqSection || isFaqStatic() === staticMode) {
      return false;
    }
    const rail = ScrollTrigger.getById(FAQ_RAIL_TRIGGER_ID);
    if (staticMode) {
      if (rail) {
        rail.disable(true, true);
        rail.animation?.progress(FAQ_RAIL_REVEALED_PROGRESS).pause();
      }
      faqSection.dataset.faqMode = "static";
    } else {
      delete faqSection.dataset.faqMode;
      rail?.enable();
    }
    ScrollTrigger.refresh();
    return true;
  };

  let restoreQueued = false;
  const onScroll = () => {
    if (!isFaqStatic() || restoreQueued || !faqSection) {
      return;
    }
    restoreQueued = true;
    requestAnimationFrame(() => {
      restoreQueued = false;
      if (isFaqStatic() && faqSection.getBoundingClientRect().top > window.innerHeight) {
        setFaqStatic(false);
      }
    });
  };

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

    if (pinned && !(section === faqSection && isFaqStatic())) {
      const progress = PINNED_REVEAL_PROGRESS[section.dataset.px ?? ""] ?? 1;
      const position = pinned.start + (pinned.end - pinned.start) * progress;
      // Stay one pixel inside the pin so the section is still pinned in view.
      return Math.max(pinned.start, Math.round(position) - 1);
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

  const goTo = (hash: string, options: { updateHistory: boolean }) => {
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    const element = id ? document.getElementById(id) : null;
    if (!element) {
      return false;
    }

    // Layout first (it changes pin spacing), then measure the destination.
    const layoutChanged = setFaqStatic(faqSection !== null && sectionOf(element) === faqSection);

    // Land, then (if pin spacing changed) re-measure every pin at the new position
    // and land again, so no other section is left pinned over the destination.
    const land = () => {
      window.scrollTo({ top: destinationFor(element), behavior: "instant" });
      if (layoutChanged) {
        ScrollTrigger.refresh();
        window.scrollTo({ top: destinationFor(element), behavior: "instant" });
      }
      settleAnimations();
    };
    land();
    // A second pass after layout settles (pins and spacers can shift by a frame).
    requestAnimationFrame(land);

    if (options.updateHistory && window.location.hash !== `#${id}`) {
      history.pushState(null, "", `#${id}`);
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
  window.addEventListener("scroll", onScroll, { passive: true });

  return {
    goTo,
    cleanup: () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("scroll", onScroll);
      if (faqSection) {
        delete faqSection.dataset.faqMode;
      }
    },
  };
}

export function LandingMotionController() {
  useLayoutEffect(() => {
    const mode = readMotionMode();
    const loader = select<HTMLElement>("[data-motion-loader]");
    const root = document.documentElement;

    root.dataset.motionMode = mode.visualTest
      ? "visual-test"
      : mode.reducedMotion
        ? "reduced"
        : "full";

    if (!mode.enabled) {
      if (loader) {
        loader.style.display = "none";
      }
      return () => {
        delete root.dataset.motionMode;
      };
    }

    const { gsap, ScrollTrigger } = getGsap();
    const previousOverflow = document.body.style.overflow;
    let scrollReleased = false;

    // Pinned sections and scrub ranges are measured in pixels. The intro locks scrolling
    // with overflow:hidden, which also removes a classic scrollbar, so everything set up
    // during the intro is measured at the full window width. When the lock is released
    // the scrollbar returns and narrows the layout (e.g. 1440 -> 1425) without a window
    // resize event, so ScrollTrigger would keep the old widths and the page would scroll
    // sideways. Re-measure whenever the real layout width (documentElement.clientWidth)
    // changes: after the release, when a scrollbar appears/disappears, and on resize.
    let measuredWidth = root.clientWidth;
    let widthFrame = 0;
    const refreshIfWidthChanged = () => {
      cancelAnimationFrame(widthFrame);
      widthFrame = requestAnimationFrame(() => {
        const width = root.clientWidth;
        if (width !== measuredWidth) {
          measuredWidth = width;
          ScrollTrigger.refresh();
        }
      });
    };
    const widthObserver = new ResizeObserver(refreshIfWidthChanged);
    widthObserver.observe(root);

    document.body.style.overflow = "hidden";

    const releaseScroll = () => {
      if (!scrollReleased) {
        document.body.style.overflow = previousOverflow;
        scrollReleased = true;
        refreshIfWidthChanged();
      }
    };

    // A direct link to a section skips the intro so the visitor lands on it at once.
    const initialHash = window.location.hash.length > 1 ? window.location.hash : "";
    const startsAtSection =
      initialHash !== "" && initialHash !== "#top" && document.getElementById(initialHash.slice(1)) !== null;

    const matchMedia = gsap.matchMedia();
    const context = gsap.context(() => {
      if (startsAtSection) {
        if (loader) {
          loader.style.display = "none";
        }
        releaseScroll();
      } else {
        setupOpeningSequence(gsap, releaseScroll);
      }
      setupHeroDeparture(gsap, matchMedia);
      setupInsightsProgress(gsap, matchMedia);
      setupTerminalReveal(gsap, matchMedia);
      setupRolesNarrative(gsap, matchMedia);
      setupInvestGptScroll(gsap, matchMedia);
      setupLearningScrollytelling(gsap, matchMedia);
      setupGlobalControlHovers(gsap, matchMedia);
      setupLearningInteractions(gsap, matchMedia);
      setupFinalCtaScrollytelling(gsap, matchMedia);
      setupFooterReveal(gsap);
      setupStoryRail(gsap, ScrollTrigger);
    }, document.body);

    const navigation = setupSectionNavigation(ScrollTrigger);

    let active = true;
    void document.fonts.ready.then(() => {
      if (active) {
        measuredWidth = root.clientWidth;
        ScrollTrigger.refresh();
        if (startsAtSection) {
          navigation.goTo(initialHash, { updateHistory: false });
        }
      }
    });

    return () => {
      active = false;
      widthObserver.disconnect();
      cancelAnimationFrame(widthFrame);
      navigation.cleanup();
      releaseScroll();
      matchMedia.revert();
      context.revert();
      delete root.dataset.motionMode;
    };
  }, []);

  return (
    <>
      <div
        data-motion-story-progress
        aria-hidden="true"
        className="pointer-events-none fixed right-5 top-1/2 z-[80] hidden -translate-y-1/2 flex-col items-end gap-3 text-white opacity-0 mix-blend-difference lg:flex"
      >
        <span
          data-motion-story-label
          className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.18em]"
        >
          Welcome
        </span>
        <span
          data-motion-story-index
          className="text-[10px] tabular-nums tracking-[0.12em] opacity-60"
        >
          01 / 07
        </span>
        <span className="relative block h-28 w-px overflow-hidden bg-white/20">
          <span
            data-motion-story-progress-fill
            className="absolute inset-0 block origin-top bg-white"
          />
        </span>
      </div>

      <div
        data-motion-loader
        aria-hidden="true"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-white [font-family:Lato,Arial,sans-serif]"
      >
        {/*
          Approved ForexLAB Access logo, rebuilt from the mark and the header
          artwork (56px tall: header scale 0.875) so the same opening motion
          applies: the mark grows in, then the wordmark is revealed.
        */}
        <div data-motion-loader-logo className="flex h-[56px] items-center">
          <span
            data-motion-loader-mark
            className="relative block h-[56px] w-[49px] shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-motion-loader-filled
              src={asset("/brand/forexlab-access-mark-light.svg")}
              alt=""
              className="absolute left-[8.59px] top-[12.09px] block h-[31.82px] w-[31.82px]"
            />
            <span data-motion-loader-outline className="absolute left-0 top-0 block h-0 w-0" />
          </span>

          <span
            data-motion-loader-word-mask
            className="block h-[56px] w-[241.5px] overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-motion-loader-word
              src={asset("/brand/forexlab-access-header-light.svg")}
              alt=""
              className="-ml-[49px] block h-[56px] w-[290.5px] max-w-none"
            />
          </span>
        </div>
      </div>
    </>
  );
}
