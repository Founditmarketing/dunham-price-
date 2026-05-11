import type { Metadata } from "next";
import { Big_Shoulders, Inter, JetBrains_Mono } from "next/font/google";

import { MobileBottomBar } from "@/components/MobileBottomBar";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-display-src",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body-src",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dunham Price Group — Concrete, Precast & Aggregates Since 1939",
  description:
    "Four generations. Four divisions. One standard. Concrete, precast, and aggregates engineered for Southwest Louisiana since 1939.",
  metadataBase: new URL("https://dunhamprice.com"),
  openGraph: {
    title: "Dunham Price Group — Since 1939",
    description:
      "Concrete, precast, and aggregates engineered for Southwest Louisiana since 1939.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        {/*
          SSR rescue: framer-motion's `initial={{ opacity: 0, y: ... }}` ships
          inline `style="opacity:0;transform:..."` to the static HTML. With JS,
          the IntersectionObserver-driven reveals run normally. Without JS,
          those inline styles would leave content invisible. This noscript
          override forces them visible for crawlers, no-JS clients, and any
          headless tooling that snapshots before JS hydrates.
        */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="bg-base text-primary font-body min-h-screen">
        {children}
        <MobileBottomBar />
      </body>
    </html>
  );
}
