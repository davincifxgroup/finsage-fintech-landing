import type { Metadata } from "next";
import "./globals.css";

import { Analytics } from "@/components/analytics/Analytics";
import { HOME_TITLE } from "@/lib/site";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description:
    "Independently evaluated MT4/MT5 Expert Advisors. The developer issues an account-bound license after your partner account is approved; broker partner commission funds the service.",
  // Not indexable: presentation-only release. Nginx also sends
  // "X-Robots-Tag: noindex, nofollow, noarchive" for every response.
  robots: { index: false, follow: false, noarchive: true },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/favicon.svg` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
