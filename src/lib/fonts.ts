import { JetBrains_Mono, Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";

export const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700"],
});

export const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
