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
 * hover-only controls, no autoplay. Transitions are dropped for reduced motion.
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
  kind: "Apr 2023 snapshot",
  src: "/research-evidence/monitoring-apr-2023.webp",
  original: "/research-evidence/monitoring-apr-2023-original.png",
  width: 1216,
  height: 463,
  alt: "Historical account monitoring snapshot, last updated 3 April 2023: growth chart and account statistics. Not current performance.",
};

const card =
  "overflow-hidden rounded-[8px] border border-black/[0.08] bg-white lg:rounded-[calc(var(--u)*8)]";
const shadowFront =
  "shadow-[0_1px_2px_rgba(15,23,42,0.05),0_14px_32px_-12px_rgba(15,23,42,0.18),0_28px_56px_-26px_rgba(15,23,42,0.22)]";
const shadowBack = "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_24px_-14px_rgba(15,23,42,0.16)]";
const header =
  "flex h-[30px] w-full items-center border-b border-black/[0.06] bg-[#fafafb] lg:h-[calc(var(--u)*30)]";
const headerMain =
  "flex h-full min-w-0 flex-1 items-center justify-between gap-3 px-3 text-left lg:gap-[calc(var(--u)*12)] lg:px-[calc(var(--u)*12)]";
const headerTitle = "truncate text-[11px] font-bold leading-none text-black lg:text-[calc(var(--u)*11)]";
const headerKind =
  "shrink-0 rounded-full bg-[#f0f0f3] px-2 py-[3px] text-[9px] font-medium leading-none text-[#5f6470] lg:px-[calc(var(--u)*8)] lg:py-[calc(var(--u)*3)] lg:text-[calc(var(--u)*9)]";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[12px] font-medium leading-none text-black lg:gap-[calc(var(--u)*8)] lg:text-[calc(var(--u)*12)]">
      <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 rounded-full bg-black lg:h-[calc(var(--u)*7)] lg:w-[calc(var(--u)*7)]" />
      {children}
    </p>
  );
}

function EnlargeButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`mr-1 inline-flex min-h-[26px] shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-[10px] py-[4px] lg:min-h-0 text-[9px] font-bold leading-none text-black hover:border-black/30 lg:mr-[calc(var(--u)*8)] lg:gap-[calc(var(--u)*4)] lg:px-[calc(var(--u)*8)] lg:py-[calc(var(--u)*4)] lg:text-[calc(var(--u)*9)] ${focusRing}`}
    >
      <svg viewBox="0 0 12 12" aria-hidden="true" className="h-[9px] w-[9px] lg:h-[calc(var(--u)*9)] lg:w-[calc(var(--u)*9)]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M7 1.5h3.5V5M5 10.5H1.5V7M10.5 1.5 7 5M1.5 10.5 5 7" />
      </svg>
      Enlarge
    </button>
  );
}

export function ResearchEvidence() {
  const [front, setFront] = useState(0);
  const [open, setOpen] = useState<Shot | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const others = reports.map((_, i) => i).filter((i) => i !== front);
  const depthOf = (i: number) => (i === front ? 0 : others.indexOf(i) + 1);

  const enlarge = (shot: Shot) => setOpen(shot);

  // Open the native modal once its content is rendered (focus moves to Close; Escape and
  // the backdrop close it and focus returns to the button that opened it).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [open]);

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
      <div className="mx-auto w-full max-w-[969px] lg:w-[calc(var(--u)*969)] lg:max-w-none">
        <div className="flex flex-col items-center gap-2 text-center lg:gap-[calc(var(--u)*8)]">
          <p className="text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-[#7b8494] lg:text-[calc(var(--u)*11)]">
            Examples of ForexLAB research
          </p>
          <p className="text-[11px] leading-[16px] text-[#8a8a8a] lg:text-[calc(var(--u)*11)] lg:leading-[calc(var(--u)*16)]">
            Different systems · simulations and a historical snapshot, not live results
          </p>
        </div>

        <div
          className="
            mt-8 grid grid-cols-1 gap-12
            lg:mt-[calc(var(--u)*30)]
            lg:grid-cols-[calc(var(--u)*548)_calc(var(--u)*380)]
            lg:justify-between
            lg:gap-0
          "
        >
          {/* Backtests & robustness: layered stack */}
          <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none">
            <Label>Backtests &amp; robustness</Label>
            <div
              role="group"
              aria-label="Backtest and robustness examples"
              className="
                relative mt-4 grid
                [--peek:24px]
                pt-[calc(var(--peek)*3)]
                lg:mt-[calc(var(--u)*16)]
                lg:[--peek:calc(var(--u)*22)]
              "
            >
              {reports.map((shot, i) => {
                const depth = depthOf(i);
                const isFront = depth === 0;
                return (
                  <div
                    key={shot.id}
                    className={`
                      ${card} ${isFront ? shadowFront : shadowBack}
                      [grid-area:1/1]
                      origin-top
                      transition-[transform,box-shadow] duration-300 ease-out
                      motion-reduce:transition-none
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
                        onClick={() => setFront(i)}
                        className={`${headerMain} ${focusRing} focus-visible:outline-offset-[-2px] ${isFront ? "cursor-default" : "cursor-pointer hover:bg-[#f3f3f5]"}`}
                      >
                        <span className={`${headerTitle} ${isFront ? "" : "text-[#4b4f58]"}`}>{shot.title}</span>
                        <span className={headerKind}>{shot.kind}</span>
                      </button>
                      {isFront ? <EnlargeButton label={`Enlarge ${shot.title}`} onClick={() => enlarge(shot)} /> : null}
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

          {/* Monitoring: single elevated frame */}
          {/* Top padding = the stack's three peeks, so both front frames start level. */}
          <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none lg:pt-[calc(var(--u)*66)]">
            <Label>Monitoring</Label>
            <div className="mt-4 lg:mt-[calc(var(--u)*16)]">
              <figure className={`${card} ${shadowFront} w-full`}>
                <figcaption className={header}>
                  <span className={headerMain}>
                    <span className={headerTitle}>Account monitoring</span>
                    <span className={headerKind}>{monitoring.kind}</span>
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
      </div>

      <dialog
        ref={dialogRef}
        aria-label={open ? `${open.title}, original image` : "Original image"}
        onClose={() => setOpen(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        className="
          m-auto max-h-[92svh] w-[min(1320px,94vw)] max-w-none overflow-auto
          rounded-[10px] border border-black/10 bg-white p-0
          shadow-[0_40px_120px_-30px_rgba(15,23,42,0.45)]
          backdrop:bg-black/55
          [font-family:Lato,Arial,sans-serif]
        "
      >
        {open ? (
          <figure className="flex flex-col">
            <figcaption className="sticky top-0 flex items-center justify-between gap-4 border-b border-black/[0.06] bg-white px-4 py-3">
              <span className="text-[13px] font-bold text-black">
                {open.title} <span className="font-normal text-[#707070]">· {open.kind}</span>
              </span>
              <span className="flex items-center gap-2">
                <a
                  href={asset(open.original)}
                  target="_blank"
                  rel="noopener"
                  className={`rounded-full border border-black/15 px-3 py-[6px] text-[12px] font-bold text-black ${focusRing}`}
                >
                  Open original
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  className={`rounded-full bg-black px-3 py-[6px] text-[12px] font-bold text-white ${focusRing}`}
                >
                  Close
                </button>
              </span>
            </figcaption>
            <div className="p-3 sm:p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(open.original)}
                alt={open.alt}
                width={open.width}
                height={open.height}
                className="mx-auto block h-auto max-w-full"
              />
            </div>
          </figure>
        ) : null}
      </dialog>
    </div>
  );
}
