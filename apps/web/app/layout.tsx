import { Toaster } from "@/components/ui/toaster";
import { NoJsSquircle } from "@squircle-element/react/dist/no-js";
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
        <NoJsSquircle />
      </body>
    </html>
  );
}
