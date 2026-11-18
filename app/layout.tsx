import type { Metadata } from "next";
import "./globals.css";

import { Analytics } from "@/components/analytics/Analytics";
import { catalogModeOf } from "@/lib/analytics";
import { getPublishedAdvisors } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "ForexLAB Access | Tested Expert Advisors. No Upfront License Payment.",
  description:
    "Independently evaluated MT4/MT5 Expert Advisors. The developer issues an account-bound license after your partner account is approved; broker partner commission funds the service.",
  // Not indexable: presentation-only release. Nginx also sends
  // "X-Robots-Tag: noindex, nofollow, noarchive" for every response.
  robots: { index: false, follow: false, noarchive: true },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/favicon.svg` },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Same cached catalog request the pages make; sets catalog_mode for every event. */}
        <Analytics catalogMode={catalogModeOf(await getPublishedAdvisors())} />
      </body>
    </html>
  );
}
