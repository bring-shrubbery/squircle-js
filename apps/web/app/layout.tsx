import { Toaster } from "@/components/ui/toaster";
import { SquircleNoScript } from "@squircle-element/react";
import "./globals.css";

import { Inter } from "next/font/google";

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
      </body>
    </html>
  );
}
