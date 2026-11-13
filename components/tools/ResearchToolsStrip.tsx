import { asset } from "@/lib/site";

/*
 * Platforms, monitoring sources and analysis tools used in ForexLAB EA research.
 *
 * A static strip directly below the first screen. The logos are the original artwork
 * (files in /public/research-tools, copied unmodified from the sources listed below);
 * nothing is redrawn. They are plain images, not links or buttons, and do not imply
 * any partnership. Monochrome by default; on devices with a fine pointer each logo shows
 * its original colours while hovered. Touch devices keep the monochrome presentation and
 * reduced-motion users get the change without a transition (see app/globals.css).
 *
 * Sources (retrieved 2026-11-11):
 *   MetaTrader 4   https://www.metatrader4.com/i/metatrader-4-logo_2x.png
 *   MetaTrader 5   https://www.metatrader5.com/i/metatrader-5-logo_2x.png
 *   Myfxbook       Google Play app icon (com.myfxbook.forex)
 *   FX Blue        https://www.fxblue.com/ header wordmark (single-colour, currentColor)
 *   MQL5           https://www.metatrader5.com/i/main/logo-mql5-small_2x.png
 *   Tick Data Suite https://eareview.net/ site logo
 *   QuantAnalyzer  https://strategyquant.com/ (qa.svg)
 *
 * Sizes keep each file's own aspect ratio (width/height attributes match it), and are
 * normalised optically: wordmarks share a common cap height, symbols a common square.
 */
type Tool = {
  name: string;
  src: string;
  width: number;
  height: number;
  /** Visible text next to a symbol-only logo; omitted for wordmarks. */
  label?: string;
};

const tools: Tool[] = [
  { name: "MetaTrader 4", src: "/research-tools/mt4.png", width: 108, height: 29 },
  { name: "MetaTrader 5", src: "/research-tools/mt5.png", width: 108, height: 29 },
  { name: "Myfxbook", src: "/research-tools/myfxbook-app-icon.png", width: 24, height: 24, label: "Myfxbook" },
  { name: "FX Blue", src: "/research-tools/fxblue.svg", width: 118, height: 15 },
  { name: "MQL5 Signals", src: "/research-tools/mql5.png", width: 66, height: 24, label: "Signals" },
  { name: "Tick Data Suite", src: "/research-tools/tds.png", width: 30, height: 22, label: "Tick Data Suite" },
  { name: "QuantAnalyzer", src: "/research-tools/quantanalyzer.svg", width: 24, height: 24, label: "QuantAnalyzer" },
];

export function ResearchToolsStrip() {
  return (
    <section
      data-px="research-tools"
      aria-labelledby="research-tools-title"
      className="research-tools border-y border-black/[0.06] bg-white px-5 py-6 [font-family:Lato,Arial,sans-serif] md:px-10 md:py-7"
    >
      <p
        id="research-tools-title"
        className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[#7b8494] md:mb-5"
      >
        Platforms and tools used in our EA research
      </p>
      <ul className="research-tools-list mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-x-8 gap-y-5 md:justify-between md:gap-x-6">
        {tools.map((tool) => (
          <li key={tool.name} className="research-tool flex min-h-[32px] items-center gap-2" title={tool.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(tool.src)}
              alt={tool.label ? "" : tool.name}
              width={tool.width}
              height={tool.height}
              loading="lazy"
              decoding="async"
              className="research-tool-logo block shrink-0 object-contain"
              style={{ width: tool.width, height: tool.height }}
            />
            {tool.label ? (
              <span className="research-tool-label whitespace-nowrap text-[13px] font-bold text-[#5d6676]">
                {tool.name === "MQL5 Signals" ? (
                  <>
                    <span className="sr-only">MQL5 </span>
                    {tool.label}
                  </>
                ) : (
                  tool.label
                )}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
