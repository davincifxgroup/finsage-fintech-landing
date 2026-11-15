import type { Metadata } from "next";

import { DotLabel, SubpageBackdrop, SubpageHeader } from "@/components/catalog/SubpageHeader";
import { Footer } from "@/components/shared/Footer";
import { formatPrice, getPublishedAdvisors } from "@/lib/catalog";
import { links } from "@/lib/site";

export const metadata: Metadata = {
  title: "Expert Advisors | ForexLAB Access",
  description: "Independently evaluated Expert Advisors available through ForexLAB Access.",
};

export default async function AdvisorsPage() {
  const advisors = await getPublishedAdvisors();

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white [font-family:Lato,Arial,sans-serif]">
      <SubpageBackdrop />
      <SubpageHeader />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-24 sm:px-8 lg:px-[60px]">
        <div className="mt-14 max-w-[760px] lg:mt-20">
          <DotLabel>Advisor Catalog</DotLabel>
          <h1 className="mt-6 text-[44px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[58px] lg:text-[72px]">
            Independently Selected Expert Advisors.
          </h1>
          <p className="mt-6 text-[15px] leading-[24px] text-[#555]">
            Every advisor is published with dated evaluation evidence, known limitations, approved broker
            compatibility and its license price, with no upfront payment. Access continues while your partner
            account stays eligible, and Access accounts do not earn cashback. Trading risk always stays with you.
          </p>
        </div>

        {advisors.length > 0 ? (
          <ul className="mt-14 grid gap-[7px] sm:grid-cols-2 lg:grid-cols-3" aria-label="Published advisors">
            {advisors.map((advisor) => (
              <li key={advisor.slug}>
                <a
                  href={`/advisors/${advisor.slug}`}
                  className="group flex h-full flex-col rounded-[6px] bg-[#f4f4f6] p-7 transition-colors hover:bg-[#ececf0]"
                >
                  <span className="text-[12px] text-[#707070]">
                    {advisor.platforms.join(" / ")} · by {advisor.vendor.displayName}
                  </span>
                  <span className="mt-3 text-[28px] font-black leading-[32px] tracking-[-0.035em]">{advisor.name}</span>
                  <span className="mt-3 text-[14px] leading-[22px] text-[#333]">{advisor.shortDescription}</span>
                  {advisor.brokers.length > 0 ? (
                    <span className="mt-4 text-[12px] leading-[18px] text-[#707070]">Brokers: {advisor.brokers.join(", ")}</span>
                  ) : null}
                  <span className="mt-auto flex items-end justify-between gap-4 pt-8">
                    <span>
                      <span className="block text-[11px] text-[#707070]">License price · No upfront payment</span>
                      <span className="text-[22px] font-black leading-none">{formatPrice(advisor.currentPrice)}</span>
                    </span>
                    <span className="text-[13px] font-bold group-hover:underline">View details →</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-14 rounded-[6px] bg-[#4e82f3] p-8 text-white sm:p-10">
            <DotLabel light>Advisor Catalog</DotLabel>
            <p className="mt-6 text-[27px] font-bold leading-[30px] tracking-[-0.025em]">The first advisors are in evaluation.</p>
            <p className="mt-4 max-w-[560px] text-[14px] leading-[22px] text-white/95">
              Listings appear only when testing is complete and the license price and support terms are approved.
              We do not publish placeholder strategies, projected returns or reviews.
            </p>
            <a href={links.register} className="mt-8 inline-flex text-[13px] font-bold">
              Create Your Account&nbsp; →
            </a>
          </div>
        )}
      </div>

      <Footer anchorBase="/" />
    </main>
  );
}
