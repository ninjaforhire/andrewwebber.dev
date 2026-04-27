import type { Metadata } from "next";
import { display, mono } from "@/lib/fonts";
import { NavRail } from "@/components/layout/NavRail";
import { InquiryPill } from "@/components/layout/InquiryPill";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { LoadingScreen } from "@/components/animation/LoadingScreen";
import { BinaryRain } from "@/components/animation/BinaryRain";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Andrew Webber — Builder / Automation Architect",
    template: "%s | andrewwebber.dev",
  },
  description:
    "170+ AI tools. 377K+ lines of code. Builder, automation architect, and creative coder from Fort Worth, TX.",
  metadataBase: new URL("https://andrewwebber.dev"),
  openGraph: {
    title: "Andrew Webber — Builder / Automation Architect",
    description:
      "170+ AI tools. 377K+ lines of code. Builder, automation architect, and creative coder from Fort Worth, TX.",
    url: "https://andrewwebber.dev",
    siteName: "andrewwebber.dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Webber — Builder / Automation Architect",
    description:
      "170+ AI tools. 377K+ lines of code. Builder, automation architect, and creative coder from Fort Worth, TX.",
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
          <BinaryRain />
          <NavRail />
          <main className="relative z-10 ml-16">{children}</main>
          <InquiryPill />
        </LenisProvider>
      </body>
    </html>
  );
}
