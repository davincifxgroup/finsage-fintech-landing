"use client";

import { useEffect, useRef, useState } from "react";

import { asset } from "@/lib/site";

/*
 * Examples of ForexLAB research, shown inside "Our Testing" below the methodology frame.
 *
 * The images are the supplied screenshots (files in /public/research-evidence). Display
 * copies keep the original pixel size; the "-original" files are byte-identical copies
 * opened in the enlarged view. Nothing is redrawn or cropped.
 *
 * They illustrate the research process across DIFFERENT systems: they are not tied to any
 * advisor, do not describe one account, and are not evidence that an advisor is listed.
 * The research images are simulations (backtests and robustness tests); the monitoring
 * image is a historical snapshot (last updated April 2023), not current live performance.
 *
 * Interaction: the exposed header of a report brings it to the front; the front image
 * (and the monitoring image) opens the original in a modal dialog. Buttons only, no
 * hover-only controls.
 *
 * Auto-rotation: the next report comes to the front every 2 seconds while the stack is on
 * screen. It pauses while the mouse is over the stack, while keyboard focus is inside it,
 * while an enlarged image is open and while the tab is hidden; a manual selection restarts
 * the 2-second wait. There is no rotation (and no transition) for reduced motion.
 */

type Shot = {
  id: string;
  title: string;
  kind: string;
  src: string;
  original: string;
  width: number;
  height: number;
  alt: string;
};

const reports: Shot[] = [
  {
    id: "equity-drawdown",
    title: "Equity & drawdown",
    kind: "Backtest",
    src: "/research-evidence/equity-drawdown-original.png",
    original: "/research-evidence/equity-drawdown-original.png",
    width: 1202,
    height: 347,
    alt: "Backtest equity curve with the drawdown chart below it, about 2,500 trades from 2022 to 2026. Simulated research example.",
  },
  {
    id: "monte-carlo",
    title: "Monte Carlo paths",
    kind: "Robustness",
    src: "/research-evidence/monte-carlo.webp",
    original: "/research-evidence/monte-carlo-original.png",
    width: 1186,
    height: 327,
    alt: "Monte Carlo robustness test: hundreds of simulated equity paths. Simulated research example.",
  },
  {
    id: "confidence-range",
    title: "Confidence range",
    kind: "Robustness",
    src: "/research-evidence/confidence-range-original.png",
    original: "/research-evidence/confidence-range-original.png",
    width: 1174,
    height: 227,
    alt: "Equity curve with a shaded Monte Carlo confidence range from 03.03.2026. Simulated research example.",
  },
  {
    id: "tester-report",
    title: "Tester report",
    kind: "Backtest",
    src: "/research-evidence/tester-report.webp",
    original: "/research-evidence/tester-report-original.jpg",
    width: 1280,
    height: 916,
    alt: "MetaTrader strategy tester report with 100% real ticks, 2,500 trades, statistics and balance chart. Simulated research example.",
  },
];

const monitoring: Shot = {
  id: "monitoring",
  title: "Monitoring",
  kind: "", // no badge; the date stays in the alt text and in the screenshot itself
  src: "/research-evidence/monitoring-apr-2023.webp",
  original: "/research-evidence/monitoring-apr-2023-original.png",
  width: 1216,
  height: 463,
  alt: "Historical account monitoring snapshot, last updated 3 April 2023: growth chart and account statistics. Not current performance.",
};

// Time each report stays in front; the change itself takes ~0.95s (see .research-card).
const ROTATE_MS = 3500;

const card =
  "overflow-hidden rounded-[8px] border border-black/[0.08] bg-white lg:rounded-[calc(var(--u)*8)]";
const shadowFront =
  "shadow-[0_1px_2px_rgba(15,23,42,0.05),0_14px_32px_-12px_rgba(15,23,42,0.18),0_28px_56px_-26px_rgba(15,23,42,0.22)]";
const shadowBack = "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_24px_-14px_rgba(15,23,42,0.16)]";
const header =
  "flex h-[44px] w-full items-center border-b border-black/[0.06] bg-[#fafafb] lg:h-[calc(var(--u)*30)]";
const headerMain =
  "flex h-full min-w-0 flex-1 items-center justify-between gap-3 px-3 text-left lg:gap-[calc(var(--u)*12)] lg:px-[calc(var(--u)*12)]";
const headerTitle = "truncate text-[13px] font-bold leading-none text-black lg:text-[calc(var(--u)*11)]";
const headerKind =
  "shrink-0 rounded-full bg-[#f0f0f3] px-2 py-[4px] text-[11px] font-medium leading-none text-[#5f6470] lg:px-[calc(var(--u)*8)] lg:py-[calc(var(--u)*3)] lg:text-[calc(var(--u)*9)]";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

function ColumnHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h4 className="text-[18px] font-black leading-[22px] tracking-[-0.02em] text-black lg:text-[calc(var(--u)*18)] lg:leading-[calc(var(--u)*22)]">
        {title}
      </h4>
      <p className="mt-[6px] text-[13.5px] leading-[20px] text-[#5f5f5f] lg:mt-[calc(var(--u)*6)] lg:text-[max(11.5px,calc(var(--u)*13))] lg:leading-[calc(var(--u)*19)]">
        {description}
      </p>
    </div>
  );
}

function EnlargeButton({
  label,
  onClick,
  fadeIn = false,
}: {
  label: string;
  onClick: () => void;
  fadeIn?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      /* Visual pill 32px (desktop: scaled); touch target 44px tall via the ::before overlay. */
      className={`relative mr-[6px] inline-flex h-[32px] shrink-0 items-center gap-[5px] rounded-full border border-black/10 bg-white px-3 text-[12px] font-bold leading-none text-black before:absolute before:inset-x-0 before:-inset-y-[6px] before:content-[''] hover:border-black/30 lg:mr-[calc(var(--u)*8)] lg:h-auto lg:gap-[calc(var(--u)*4)] lg:px-[calc(var(--u)*8)] lg:py-[calc(var(--u)*4)] lg:text-[calc(var(--u)*9)] ${fadeIn ? "research-fade-in" : ""} ${focusRing}`}
    >
      <svg viewBox="0 0 12 12" aria-hidden="true" className="h-[11px] w-[11px] lg:h-[calc(var(--u)*9)] lg:w-[calc(var(--u)*9)]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M7 1.5h3.5V5M5 10.5H1.5V7M10.5 1.5 7 5M1.5 10.5 5 7" />
      </svg>
      Enlarge
    </button>
  );
}

export function ResearchEvidence() {
  const [front, setFront] = useState(0);
  // The report that just left the front: it fades out on its way to the back.
  const [receding, setReceding] = useState<number | null>(null);
  const bringToFront = (index: number) => {
    if (index === front) {
      return;
    }
    setReceding(front);
    setFront(index);
  };
  const [open, setOpen] = useState<Shot | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Deck order: the report right behind the front is the next one. On each step every card
  // moves forward one place and the former front goes to the back, so no card passes
  // through another.
  const depthOf = (i: number) => (i - front + reports.length) % reports.length;

  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [zoomWidth, setZoomWidth] = useState(0);

  const enlarge = (shot: Shot) => {
    setZoomed(false);
    setOpen(shot);
  };

  /*
    Auto-rotation. A timeout (not an interval) is scheduled after every change of the front
    report, so a manual selection always restarts the full 2-second wait. Every condition
    below pauses it; the timer and all listeners are cleared on change and on unmount.
  */
  const stackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true); // until measured on the client

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    );
    observer.observe(stack);
    return () => observer.disconnect();
  }, []);

  const rotating =
    !reducedMotion && inView && pageVisible && !hovered && !focused && open === null;

  useEffect(() => {
    if (!rotating) {
      return;
    }
    const timer = window.setTimeout(() => {
      setReceding(front);
      setFront((front + 1) % reports.length);
    }, ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [rotating, front]);

  // Open the native modal once its content is rendered (focus moves to Close; Escape, Close
  // and the backdrop close it and focus returns to the button that opened it).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [open]);

  /*
    Background scroll lock while the dialog is open. It deliberately changes no page styles
    (no overflow/position on html or body), so the intro lock, ScrollTrigger and the
    scrollbar-width measurements in LandingMotionController are untouched:
    - wheel, touch and keyboard scrolling are blocked unless they scroll the image viewport
      inside the dialog (which has overscroll-behavior: contain);
    - any scroll that still reaches the page (e.g. dragging the scrollbar) is put back;
    - the saved position is restored on every closing path and on unmount.
  */
  useEffect(() => {
    if (!open) {
      return;
    }
    const dialog = dialogRef.current;
    const savedX = window.scrollX;
    const savedY = window.scrollY;
    let touchX = 0;
    let touchY = 0;

    const scrollsInside = (target: EventTarget | null, dx: number, dy: number) => {
      const viewport = viewportRef.current;
      if (!viewport || !(target instanceof Node) || !viewport.contains(target)) {
        return false;
      }
      const canX = dx < 0
        ? viewport.scrollLeft > 0
        : dx > 0 && viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1;
      const canY = dy < 0
        ? viewport.scrollTop > 0
        : dy > 0 && viewport.scrollTop + viewport.clientHeight < viewport.scrollHeight - 1;
      return canX || canY;
    };
    const onWheel = (event: WheelEvent) => {
      if (!scrollsInside(event.target, event.deltaX, event.deltaY)) {
        event.preventDefault();
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      touchX = event.touches[0]?.clientX ?? 0;
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || event.touches.length > 1) {
        return; // pinch-zoom stays with the browser
      }
      const dx = touchX - touch.clientX;
      const dy = touchY - touch.clientY;
      touchX = touch.clientX;
      touchY = touch.clientY;
      if (!scrollsInside(event.target, dx, dy)) {
        event.preventDefault();
      }
    };
    const scrollKeys = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (!scrollKeys.has(event.key) || target?.closest("button, a, input, select, textarea")) {
        return; // Space and Enter still activate buttons and links
      }
      if (!(target && viewportRef.current?.contains(target))) {
        event.preventDefault();
      }
    };
    const onScroll = () => {
      if (window.scrollX !== savedX || window.scrollY !== savedY) {
        window.scrollTo(savedX, savedY);
      }
    };

    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    document.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    document.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("wheel", onWheel, { capture: true });
      document.removeEventListener("touchstart", onTouchStart, { capture: true });
      document.removeEventListener("touchmove", onTouchMove, { capture: true });
      document.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("scroll", onScroll);
      if (window.scrollX !== savedX || window.scrollY !== savedY) {
        window.scrollTo(savedX, savedY);
      }
      if (dialog?.open) {
        dialog.close(); // unmounted while open: never leave a modal or listeners behind
      }
    };
  }, [open]);

  // Magnified view: the original at its full pixel size (at least twice the fitted width on
  // wide screens), panned by scrolling or dragging inside the image viewport.
  const toggleZoom = (anchor?: { x: number; y: number }) => {
    const viewport = viewportRef.current;
    if (!viewport || !open) {
      return;
    }
    if (zoomed) {
      setZoomed(false);
      viewport.scrollTo(0, 0);
      return;
    }
    const fitWidth = Math.max(viewport.clientWidth - 24, 1);
    const width = Math.min(open.width * 2, Math.max(open.width, fitWidth * 2));
    setZoomWidth(width);
    setZoomed(true);
    requestAnimationFrame(() => {
      const ratio = width / fitWidth;
      const x = anchor ? anchor.x * ratio - viewport.clientWidth / 2 : 0;
      const y = anchor ? anchor.y * ratio - viewport.clientHeight / 2 : 0;
      viewport.scrollTo(Math.max(0, x), Math.max(0, y));
    });
  };

  return (
    <div
      data-px="insights.evidence"
      className="
        relative z-10 mx-auto w-full
        px-5 pb-20 pt-4
        sm:px-8
        lg:w-[min(100vw,calc(100svh*1.4913151365))]
        lg:px-0
        lg:pb-[max(calc(var(--u)*64),72px)]
        lg:pt-[calc(var(--u)*4)]
        lg:[container-type:inline-size]
        lg:[--u:0.0831946755cqw]
      "
    >
      <div className="mx-auto w-full max-w-[969px] lg:w-[calc(var(--u)*1040)] lg:max-w-none">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-balance text-[30px] font-black leading-[1.08] tracking-[-0.045em] text-black sm:text-[34px] lg:text-[calc(var(--u)*36)] lg:leading-[calc(var(--u)*40)]">
            Beyond Backtests. Real Evidence.
          </h3>
          <p className="mt-4 max-w-[620px] text-[14px] leading-[21px] text-[#5f5f5f] lg:mt-[calc(var(--u)*14)] lg:max-w-[calc(var(--u)*660)] lg:text-[max(12px,calc(var(--u)*14))] lg:leading-[calc(var(--u)*21)]">
            We use advanced robustness testing tools to challenge trading strategies, assess
            their risks, and cross-check backtest results against real trading account
            records.
          </p>
        </div>

        <div
          className="
            mt-10 grid grid-cols-1 gap-12
            lg:mt-[calc(var(--u)*34)]
            lg:grid-cols-[calc(var(--u)*506)_calc(var(--u)*506)]
            lg:justify-between
            lg:gap-0
          "
        >
          {/* Advanced robustness testing: layered stack */}
          <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none">
            <ColumnHeading
              title="Advanced Robustness Testing"
              description="Monte Carlo simulations, stress testing, and statistical validation."
            />
            <div
              ref={stackRef}
              role="group"
              aria-roledescription="carousel"
              aria-label="Backtest and robustness examples"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setHovered(true);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setHovered(false);
              }}
              onFocus={(event) => {
                // Keyboard focus only: a mouse click focuses the header button too, and
                // rotation must resume once the cursor leaves.
                if (event.target.matches(":focus-visible")) setFocused(true);
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setFocused(false);
                }
              }}
              className="
                relative mt-5 grid
                [--peek:40px]
                pt-[calc(var(--peek)*3)]
                lg:mt-[calc(var(--u)*18)]
                lg:[--peek:calc(var(--u)*22)]
              "
            >
              {reports.map((shot, i) => {
                const depth = depthOf(i);
                const isFront = depth === 0;
                return (
                  <div
                    key={shot.id}
                    onAnimationEnd={(event) => {
                      if (event.animationName === "research-recede") setReceding(null);
                    }}
                    className={`
                      ${card} ${isFront ? shadowFront : shadowBack}
                      research-card
                      ${receding === i && !isFront ? "research-card--receding" : ""}
                      [grid-area:1/1]
                      origin-top
                    `}
                    style={{
                      transform: `translateY(calc(var(--peek) * ${-depth})) scale(${1 - depth * 0.045})`,
                      zIndex: 10 - depth,
                    }}
                  >
                    <div className={header}>
                      <button
                        type="button"
                        aria-pressed={isFront}
                        aria-label={isFront ? `${shot.title} (${shot.kind}), shown` : `Show ${shot.title} (${shot.kind})`}
                        onClick={() => bringToFront(i)}
                        className={`${headerMain} ${focusRing} focus-visible:outline-offset-[-2px] ${isFront ? "cursor-default" : "cursor-pointer hover:bg-[#f3f3f5]"}`}
                      >
                        <span className={`${headerTitle} transition-colors duration-700 ${isFront ? "" : "text-[#4b4f58]"}`}>{shot.title}</span>
                        <span className={headerKind}>{shot.kind}</span>
                      </button>
                      {isFront ? <EnlargeButton label={`Enlarge ${shot.title}`} onClick={() => enlarge(shot)} fadeIn /> : null}
                    </div>
                    <div inert={!isFront} className="relative aspect-[2.6/1] bg-white">
                      {/* Pointer shortcut; the keyboard path is the Enlarge button in the header. */}
                      <div
                        onClick={() => enlarge(shot)}
                        className="absolute inset-0 flex cursor-zoom-in items-center justify-center p-2 lg:p-[calc(var(--u)*8)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset(shot.src)}
                          alt={shot.alt}
                          width={shot.width}
                          height={shot.height}
                          loading="lazy"
                          decoding="async"
                          className="block h-auto max-h-full w-auto max-w-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real account verification: single frame, same width as the stack */}
          <div className="mx-auto flex w-full max-w-[560px] flex-col lg:mx-0 lg:max-w-none">
            <ColumnHeading
              title="Real Account Verification"
              description="Comparing simulated results with actual trading performance."
            />
            {/* Desktop: the column is as tall as the left one, so the frame sits centred
                against the whole stack (its peeking headers included). */}
            <div className="mt-5 lg:mt-[calc(var(--u)*18)] lg:flex lg:flex-1 lg:items-center">
              <figure className={`${card} ${shadowFront} w-full`}>
                <figcaption className={header}>
                  <span className={headerMain}>
                    <span className={headerTitle}>Account monitoring</span>
                  </span>
                  <EnlargeButton label="Enlarge monitoring snapshot (April 2023)" onClick={() => enlarge(monitoring)} />
                </figcaption>
                <div onClick={() => enlarge(monitoring)} className="cursor-zoom-in p-2 lg:p-[calc(var(--u)*8)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(monitoring.src)}
                    alt={monitoring.alt}
                    width={monitoring.width}
                    height={monitoring.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </div>
              </figure>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-[12px] leading-[18px] text-[#8a8a8a] lg:mt-[calc(var(--u)*28)] lg:text-[max(10.5px,calc(var(--u)*11.5))] lg:leading-[calc(var(--u)*17)]">
          Illustrative research examples from different trading systems.
        </p>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={open ? `${open.title}, original image` : "Original image"}
        onClose={() => {
          setOpen(null);
          setZoomed(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close(); // backdrop click
          }
        }}
        className="
          m-auto max-h-[92svh] w-[min(1320px,94vw)] max-w-none overflow-hidden
          rounded-[10px] border border-black/10 bg-white p-0
          shadow-[0_40px_120px_-30px_rgba(15,23,42,0.45)]
          backdrop:bg-black/55
          open:flex open:flex-col
          [font-family:Lato,Arial,sans-serif]
        "
      >
        {open ? (
          <>
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-black/[0.06] bg-white px-4 py-2">
              <p className="min-w-0 py-1 text-[14px] font-bold text-black">
                {open.title}
                {open.kind ? <span className="font-normal text-[#707070]"> · {open.kind}</span> : null}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-pressed={zoomed}
                  onClick={() => toggleZoom()}
                  className={`inline-flex h-[44px] items-center rounded-full border border-black/15 px-4 text-[13px] font-bold text-black sm:h-[36px] ${focusRing}`}
                >
                  {zoomed ? "Fit to screen" : "Zoom in"}
                </button>
                <a
                  href={asset(open.original)}
                  target="_blank"
                  rel="noopener"
                  className={`inline-flex h-[44px] items-center rounded-full border border-black/15 px-4 text-[13px] font-bold text-black sm:h-[36px] ${focusRing}`}
                >
                  Open original
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  className={`inline-flex h-[44px] items-center rounded-full bg-black px-4 text-[13px] font-bold text-white sm:h-[36px] ${focusRing}`}
                >
                  Close
                </button>
              </div>
            </div>
            <div
              ref={viewportRef}
              tabIndex={zoomed ? 0 : -1}
              role={zoomed ? "region" : undefined}
              aria-label={zoomed ? "Magnified image, scroll to pan" : undefined}
              className={`min-h-0 flex-1 overflow-auto overscroll-contain p-3 sm:p-4 ${focusRing} focus-visible:outline-offset-[-3px]`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(open.original)}
                alt={open.alt}
                width={open.width}
                height={open.height}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  toggleZoom({ x: event.clientX - rect.left, y: event.clientY - rect.top });
                }}
                className={
                  zoomed
                    ? "block h-auto max-w-none cursor-zoom-out"
                    : "mx-auto block h-auto max-h-[calc(92svh-150px)] w-auto max-w-full cursor-zoom-in object-contain"
                }
                style={zoomed ? { width: zoomWidth } : undefined}
              />
            </div>
          </>
        ) : null}
      </dialog>
    </div>
  );
}
