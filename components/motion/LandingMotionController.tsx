"use client";

import { useLayoutEffect } from "react";

import { getGsap } from "@/lib/motion/gsap";
import { readMotionMode } from "@/lib/motion/motion-mode";
import { asset } from "@/lib/site";

import { setupStoryRail } from "./storyRail";

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

  // One rail between each pair of consecutive steps.
  if (
    !section ||
    !header ||
    !tabs ||
    !copy ||
    !process ||
    nodes.length < 2 ||
    rails.length !== nodes.length - 1
  ) {
    return;
  }

  const lit = { backgroundColor: "#000000", borderColor: "#000000" };
  // Rails are drawn one after another between these timeline positions.
  const railStart = 0.36;
  const railSpan = 0.56 / rails.length;

  gsap.set(rails, {
    autoAlpha: 1,
    scaleY: 0,
    transformOrigin: "top center",
  });
  gsap.set(nodes[0], lit);
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
        { autoAlpha: 0.14, x: 44, stagger: 0.03, duration: 0.18 },
        0.25,
      );

    rails.forEach((rail, index) => {
      const at = railStart + index * railSpan;
      const node = nodes[index + 1];
      timeline
        .to(rail, { scaleY: 1, duration: railSpan * 0.75 }, at)
        .to(node, { ...lit, scale: 1.2, duration: 0.05 }, at + railSpan * 0.7)
        .to(node, { scale: 1, duration: 0.04 }, at + railSpan * 0.7 + 0.05);
    });
  });

  matchMedia.add("(max-width: 1023px)", () => {
    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: process,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    rails.forEach((rail, index) => {
      const at = 0.15 + index * 0.45;
      timeline
        .to(rail, { scaleY: 1, duration: 0.4 }, at)
        .to(nodes[index + 1], { ...lit, duration: 0.16 }, at + 0.38);
    });
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
const PINNED_REVEAL_PROGRESS: Record<string, number> = {
  insights: 1,
  challenges: 1,
  "final-cta": 1,
};

function setupSectionNavigation(
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

    const land = () => {
      window.scrollTo({ top: destinationFor(element), behavior: "instant" });
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

  return {
    goTo,
    cleanup: () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
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

    // The FAQ accordion is in normal flow: opening or closing an answer changes the page
    // height, so the pinned sections after it are re-measured once the change settles.
    const faq = select<HTMLElement>("[data-px='learning']");
    let measuredFaqHeight = faq?.offsetHeight ?? 0;
    let faqTimer = 0;
    const faqObserver = new ResizeObserver(() => {
      if (!faq || faq.offsetHeight === measuredFaqHeight) {
        return;
      }
      window.clearTimeout(faqTimer);
      faqTimer = window.setTimeout(() => {
        measuredFaqHeight = faq.offsetHeight;
        ScrollTrigger.refresh();
      }, 120);
    });
    if (faq) {
      faqObserver.observe(faq);
    }

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
    // setupStoryRail registers window and ScrollTrigger listeners and may queue a frame;
    // context.revert() does not remove those, so its own cleanup is kept and called below.
    let cleanupStoryRail = () => {};
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
      setupGlobalControlHovers(gsap, matchMedia);
      setupFinalCtaScrollytelling(gsap, matchMedia);
      setupFooterReveal(gsap);
      cleanupStoryRail = setupStoryRail(gsap, ScrollTrigger);
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
      faqObserver.disconnect();
      window.clearTimeout(faqTimer);
      cancelAnimationFrame(widthFrame);
      navigation.cleanup();
      cleanupStoryRail();
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
