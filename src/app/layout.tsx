import type { Metadata, Viewport } from "next";
import { display, mono } from "@/lib/fonts";
import { NavRail } from "@/components/layout/NavRail";
import { MobileDock } from "@/components/layout/MobileDock";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { InquiryPill } from "@/components/layout/InquiryPill";
import { Footer } from "@/components/layout/Footer";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { LoadingScreen } from "@/components/animation/LoadingScreen";
import { FocusAudio } from "@/components/animation/FocusAudio";
import { SITE_STATS } from "@/lib/site-stats";
import "./globals.css";

const siteDescription = `Systems architect, agentic engineer, and cybersecurity expert. ${SITE_STATS.agentsLive} autonomous agents, ${SITE_STATS.skills} skills, ${SITE_STATS.linesOfCode.toLocaleString()} lines of code in 2026. Fort Worth, TX.`;

export const metadata: Metadata = {
  title: {
    default: "Andrew Webber — Systems Architect · Agentic Engineer · Cybersecurity Expert",
    template: "%s | andrewwebber.dev",
  },
  description: siteDescription,
  metadataBase: new URL("https://andrewwebber.dev"),
  openGraph: {
    title: "Andrew Webber — Systems Architect · Agentic Engineer · Cybersecurity Expert",
    description: siteDescription,
    url: "https://andrewwebber.dev",
    siteName: "andrewwebber.dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Webber — Systems Architect · Agentic Engineer · Cybersecurity Expert",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f0f1a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <LoadingScreen />
        <FocusAudio />
        <LenisProvider>
          <MobileTopBar />
          <NavRail />
          <main className="relative z-10 pb-24 md:ml-20 md:pb-0">{children}</main>
          <Footer />
          <InquiryPill />
          <MobileDock />
        </LenisProvider>
      </body>
    </html>
  );
}
