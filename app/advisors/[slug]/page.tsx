import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DotLabel, SubpageBackdrop, SubpageHeader } from "@/components/catalog/SubpageHeader";
import { Footer } from "@/components/shared/Footer";
import { formatDate, formatPrice, getPublishedAdvisor, safeAnalysisUrl } from "@/lib/catalog";
import { ACCESS_ONBOARDING_OPEN, advisorTitle, links, selectAdvisorUrl } from "@/lib/site";
import { OnboardingAction } from "@/components/shared/OnboardingAction";
import { AnalyticsPage } from "@/components/analytics/AnalyticsPage";
import { ctaAttributes } from "@/lib/analytics";

type Params = { slug: string };

/*
  No generateStaticParams: that would register this route for static generation with
  on-demand fallback, which conflicts with uncached (revalidate 0) catalog fetches and
  fails at runtime with DYNAMIC_SERVER_USAGE. Pages render on request; the catalog
  fetch itself is cached for ACCESS_CATALOG_REVALIDATE_SECONDS (default 60).
*/

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const advisor = await getPublishedAdvisor((await params).slug);
  return advisor
    ? { title: advisorTitle(advisor), description: advisor.shortDescription }
    : { title: "Advisor not found | ForexLAB Access" };
}

function Block({ label, children, id }: { label: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="grid gap-5 border-t border-black/15 py-10 lg:grid-cols-[260px_1fr] lg:gap-12 lg:py-12">
      <DotLabel>{label}</DotLabel>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Prose({ text }: { text: string }) {
  return <p className="whitespace-pre-line text-[15px] leading-[25px] text-[#333]">{text}</p>;
}

export default async function AdvisorPage({ params }: { params: Promise<Params> }) {
  const advisor = await getPublishedAdvisor((await params).slug);
  if (!advisor) {
    notFound();
  }
  const analysisUrl = safeAnalysisUrl(advisor.analysisUrl);
  // A detail page exists only for a listed advisor: demo fixture or live listing.
  const catalogMode = advisor.demo ? "demo" : "live";

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white [font-family:Lato,Arial,sans-serif]">
      <SubpageBackdrop />
      <SubpageHeader />
      <AnalyticsPage route="advisor" catalogMode={catalogMode} advisorSlug={advisor.slug} title={advisorTitle(advisor)} />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-20 sm:px-8 lg:px-[60px]">
        <Link href="/advisors" {...ctaAttributes("advisor_detail_back", "catalog")} className="mt-10 inline-flex text-[13px] font-bold lg:mt-14">
          ← All advisors
        </Link>

        {/* Intro + price */}
        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <DotLabel>{advisor.demo ? "Demo · Fictional advisor" : "Advisor Catalog"}</DotLabel>
            <h1 className="mt-6 text-[44px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[58px] lg:text-[72px]">
              {advisor.name}
            </h1>
            <p className="mt-5 text-[14px] text-[#555]">
              by <span className="font-bold text-black">{advisor.vendor.displayName}</span>
              <span className="mx-2 text-black/30">·</span>
              {advisor.platforms.join(" / ")}
            </p>
            <p className="mt-6 max-w-[620px] text-[17px] leading-[27px] text-[#333]">{advisor.shortDescription}</p>
            <ul className="mt-7 flex flex-wrap gap-[2px]" aria-label="Platforms and brokers">
              {advisor.platforms.map((platform) => (
                <li key={platform} className="inline-flex h-[27px] items-center rounded-[5px] bg-black px-[13px] text-[11px] text-white">
                  {platform}
                </li>
              ))}
              {advisor.brokers.map((broker) => (
                <li key={broker} className="inline-flex h-[27px] items-center rounded-[5px] bg-[#f3f3f5] px-[13px] text-[11px] text-[#555]">
                  {broker}
                </li>
              ))}
            </ul>
          </div>

          <aside aria-label="License price" className="rounded-[6px] bg-[#f4f4f6] p-7 lg:sticky lg:top-8">
            <p className="text-[12px] text-[#707070]">{advisor.demo ? "Example license price" : <>License price · <span className="font-bold text-black">No upfront payment</span></>}</p>
            <p className="mt-2 text-[44px] font-black leading-none tracking-[-0.04em]">{formatPrice(advisor.currentPrice)}</p>
            <p className="mt-2 text-[12px] text-[#707070]">
              {advisor.currentPrice.currency} · {advisor.demo ? "illustrative price only" : `in effect since ${formatDate(advisor.currentPrice.effectiveFrom)}`}
            </p>
            <p className="mt-6 text-[13px] leading-[20px] text-[#333]">
              No upfront payment: broker partner commission funds the service and this price is never invoiced. Covering it
              does not grant ownership or permanent access; access continues while your account stays eligible. Access
              accounts do not earn cashback.
            </p>
            <div className="mt-6 rounded-[5px] bg-white px-4 py-3 text-[12px] leading-[18px] text-[#555]">
              {advisor.demo ? (
                <>Fictional listing for demonstration only. No software or license is available, and this example cannot be selected.</>
              ) : (
                <>Select this advisor in your ForexLAB dashboard, then choose the trading account. ForexLAB confirms the
                account, and the developer issues a license bound to it. New here? Create an account first.</>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-[3px]">
              <OnboardingAction
                href={selectAdvisorUrl(advisor.slug)}
                analytics={{ placement: "advisor_detail_get_advisor", destination: "dashboard", advisorSlug: advisor.slug }}
                className="flex h-[42px] items-center justify-center rounded-[11px] bg-black text-[13px] font-bold text-white">
                Get This Advisor →
              </OnboardingAction>
              {ACCESS_ONBOARDING_OPEN ? (
                <a
                  href={links.register}
                  {...ctaAttributes("advisor_detail_create_account", "register")}
                  className="flex h-[42px] items-center justify-center rounded-[11px] border border-black text-[13px] font-bold"
                >
                  Create Account
                </a>
              ) : null}
            </div>
          </aside>
        </div>

        <div className="mt-16 lg:mt-20">
          <Block label="About this advisor">
            <Prose text={advisor.description} />
          </Block>

          <Block label="Evaluation" id="evaluation">
            <Prose text={advisor.evaluationSummary} />
            {analysisUrl ? (
              <p className="mt-4">
                <a
                  href={analysisUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-[44px] items-center gap-1 text-[14px] font-bold underline underline-offset-4"
                >
                  Read full analysis on EA ForexLab <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            ) : null}
            <ol className="mt-8 grid gap-3" aria-label="Dated evaluation evidence">
              {advisor.evidence.map((item, index) => (
                <li key={`${item.title}-${index}`} className="rounded-[6px] bg-[#f4f4f6] p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-[16px] font-bold leading-[22px]">{item.title}</h3>
                    <span className="rounded-full bg-white px-[10px] py-[5px] text-[11px] leading-none">
                      Evaluated {formatDate(item.evaluatedOn)}
                    </span>
                  </div>
                  <dl className="mt-4 grid gap-x-8 gap-y-2 text-[13px] sm:grid-cols-2">
                    {item.periodStart || item.periodEnd ? (
                      <div>
                        <dt className="text-[#707070]">Test period</dt>
                        <dd>{formatDate(item.periodStart)} – {formatDate(item.periodEnd)}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="text-[#707070]">Source</dt>
                      <dd>{item.source}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 whitespace-pre-line text-[14px] leading-[22px] text-[#333]">{item.summary}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-[12px] leading-[18px] text-[#707070]">
              Past or simulated performance does not guarantee future results.
            </p>
          </Block>

          <Block label="Known limitations">
            <Prose text={advisor.knownLimitations} />
          </Block>

          <Block label="Broker compatibility" id="compatibility">
            <p className="text-[14px] leading-[22px] text-[#555]">
              {advisor.demo
                ? "Illustrative combinations only. No broker compatibility has been approved for this fictional advisor."
                : "Only the broker, account type and platform combinations below are approved for this advisor."}
            </p>
            {/* Phones: stacked rows, no horizontal scrolling. */}
            <ul className="mt-6 border-t border-black/15 sm:hidden" aria-label={advisor.demo ? "Illustrative combinations" : "Approved combinations"}>
              {advisor.compatibility.map((row) => (
                <li key={`m-${row.broker}-${row.accountType}-${row.platform}`} className="border-b border-black/10 py-3">
                  <p className="text-[15px] font-bold">{row.broker}</p>
                  <p className="mt-1 text-[13px] text-[#555]">
                    {row.accountType} · {row.platform}
                    {row.note ? ` · ${row.note}` : ""}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 hidden sm:block">
              <table className="w-full border-collapse text-left text-[14px]">
                <thead>
                  <tr className="text-[12px] text-[#707070]">
                    <th scope="col" className="border-b border-black/15 py-3 pr-4 font-normal">Broker</th>
                    <th scope="col" className="border-b border-black/15 py-3 pr-4 font-normal">Account type</th>
                    <th scope="col" className="border-b border-black/15 py-3 pr-4 font-normal">Platform</th>
                    <th scope="col" className="border-b border-black/15 py-3 font-normal">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {advisor.compatibility.map((row) => (
                    <tr key={`${row.broker}-${row.accountType}-${row.platform}`}>
                      <td className="border-b border-black/10 py-3 pr-4 font-bold">{row.broker}</td>
                      <td className="border-b border-black/10 py-3 pr-4">{row.accountType}</td>
                      <td className="border-b border-black/10 py-3 pr-4">{row.platform}</td>
                      <td className="border-b border-black/10 py-3 text-[#555]">{row.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>

          <Block label="License terms">
            <Prose text={advisor.licenseTerms} />
          </Block>

          <Block label="Support terms">
            <Prose text={advisor.supportTerms} />
          </Block>

          <p className="border-t border-black/15 pt-8 text-[12px] leading-[19px] text-[#707070]">
            Trading involves risk of capital loss. Returns are never guaranteed, and there is no fixed date by which a
            license price is covered. Access does not change spreads, commissions or other trading conditions.
          </p>
        </div>
      </div>

      <Footer anchorBase="/" />
    </main>
  );
}
