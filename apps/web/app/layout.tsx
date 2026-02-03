import { SquircleNoScript } from "@squircle-js/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import "./prismjs-atom-one-dark.css";

import type { Metadata } from "next";
import { Cutive_Mono, Inter } from "next/font/google";
import Script from "next/script";
import PlausibleProvider from "next-plausible";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cutiveMono = Cutive_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cutive-mono",
});

export const metadata: Metadata = {
  title: "Squircle.js",
  description: "Create squircle shapes with CSS and JavaScript",
  keywords: [
    "squircle",
    "corner smoothing",
    "ios corner smoothing",
    "ios continuous corner for web",
    "ios continuous corner",
    "ios rounded corners",
    "continuous corner html",
    "continuous corner css",
    "rounded corners",
    "rounded rectangle",
    "rounded square",
    "rounded shape",
    "rounded",
    "shape",
    "css",
    "javascript",
    "web development",
    "web design",
    "web",
    "design",
    "development",
    "webdev",
    "webdesign",
    "webdevelopment",
  ],
  abstract: "Create squircle shapes with CSS and JavaScript",
  alternates: {
    canonical: "https://squircle.js.org/",
  },
  applicationName: "Squircle.js",
  authors: [
    { name: "Antoni Silvestrovic", url: "https://github.com/bring-shrubbery" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cutiveMono.variable} font-sans`}>
        <PlausibleProvider domain="squircle.js.org">
          {children}

          <Toaster />
          <SquircleNoScript />
          <SpeedInsights />
        </PlausibleProvider>

        <Script
          async
          data-website-id="462285f6-d3c4-45ce-bb91-fe99a81c97cc"
          src="/stats/script.js"
        />
      </body>
    </html>
  );
}
