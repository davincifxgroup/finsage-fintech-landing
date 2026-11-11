import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForexLAB Access | Expert-Tested Trading Bots Without the Upfront Price",
  description:
    "Independently evaluated Expert Advisors. Your allocation of confirmed broker partner commissions covers the agreed license price.",
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
