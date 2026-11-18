import "@fontsource/lato/400.css";
import "@fontsource/lato/900.css";

import Link from "next/link";

import { ctaAttributes } from "@/lib/analytics";
import { asset, COMING_SOON, links, sectionNav } from "@/lib/site";
import { OnboardingAction } from "@/components/shared/OnboardingAction";

/** Header for catalog subpages: same logo, links and sign-in entries as the homepage. */
export function SubpageHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 pt-6 sm:px-8 lg:px-[60px] lg:pt-8">
      <Link href="/" className="block shrink-0" aria-label="ForexLAB Access home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/brand/forexlab-access-header-light.svg")}
          alt="ForexLAB Access"
          width={332}
          height={64}
          className="-ml-2 block h-[44px] w-auto lg:h-[58px]"
        />
      </Link>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <nav aria-label="Main" className="flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
          {sectionNav.map((item) => (
            <a key={item.label} href={`/${item.href}`} className="whitespace-nowrap underline underline-offset-2">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={links.login} {...ctaAttributes("header_login", "login")} className="inline-flex h-[34px] items-center whitespace-nowrap rounded-full bg-black px-4 text-[13px] font-bold text-white">
            Client Log In
          </a>
          <OnboardingAction
            href={links.vendorLogin}
            analytics={{ placement: "header_vendor", destination: "vendor_portal" }}
            closedLabel={`Vendor Login · ${COMING_SOON}`}
            className="inline-flex h-[34px] items-center whitespace-nowrap rounded-full border border-black px-4 text-[13px] font-bold"
          >
            Vendor Login
          </OnboardingAction>
        </div>
      </div>
    </header>
  );
}

/** The soft Finsage top gradient used behind subpage headers. */
export function SubpageBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px] bg-[radial-gradient(ellipse_at_16%_0%,rgba(255,214,236,0.72)_0%,rgba(255,226,241,0.35)_32%,transparent_65%),radial-gradient(ellipse_at_88%_2%,rgba(214,233,255,0.78)_0%,rgba(232,242,255,0.42)_34%,transparent_67%)]"
    />
  );
}

/** Section label with the black dot used throughout the homepage. */
export function DotLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className="flex items-center gap-2 text-[13px] font-medium leading-none">
      <span aria-hidden="true" className={`h-[7px] w-[7px] rounded-full ${light ? "bg-white" : "bg-black"}`} />
      {children}
    </p>
  );
}
