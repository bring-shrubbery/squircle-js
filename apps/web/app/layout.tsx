import { Toaster } from "@/components/ui/toaster";
import { SquircleNoScript } from "@squircle-js/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import "./prismjs-atom-one-dark.css";

import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
        <SquircleNoScript />
        <SpeedInsights />

        <Script
          async
          src="/stats/script.js"
          data-website-id="462285f6-d3c4-45ce-bb91-fe99a81c97cc"
        />
      </body>
    </html>
  );
}
