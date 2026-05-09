import type { Metadata } from "next";
import { display, mono } from "@/lib/fonts";
import { NavRail } from "@/components/layout/NavRail";
import { InquiryPill } from "@/components/layout/InquiryPill";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { LoadingScreen } from "@/components/animation/LoadingScreen";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Andrew Webber — Systems Architect · Agentic Engineer · Cybersecurity",
    template: "%s | andrewwebber.dev",
  },
  description:
    "Systems architect, agentic engineer, and cybersecurity builder. 31 autonomous agents, 193 skills, 1.3M+ lines of code. Fort Worth, TX.",
  metadataBase: new URL("https://andrewwebber.dev"),
  openGraph: {
    title: "Andrew Webber — Systems Architect · Agentic Engineer · Cybersecurity",
    description:
      "Systems architect, agentic engineer, and cybersecurity builder. 31 autonomous agents, 193 skills, 1.3M+ lines of code. Fort Worth, TX.",
    url: "https://andrewwebber.dev",
    siteName: "andrewwebber.dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Webber — Systems Architect · Agentic Engineer · Cybersecurity",
    description:
      "Systems architect, agentic engineer, and cybersecurity builder. 31 autonomous agents, 193 skills, 1.3M+ lines of code. Fort Worth, TX.",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${display.variable} ${mono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <LoadingScreen />
        <LenisProvider>
          <NavRail />
          <main className="relative z-10 ml-20">{children}</main>
          <InquiryPill />
        </LenisProvider>
      </body>
    </html>
  );
}
