import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForexLAB Access | Tested Expert Advisors. No Upfront License Payment.",
  description:
    "Independently evaluated MT4/MT5 Expert Advisors. The developer issues an account-bound license after your partner account is approved; broker partner commission funds the service.",
  // Review build only: not indexable until Access is published.
  robots: { index: false, follow: false },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/favicon.svg` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
