import type { Metadata } from "next";
import { WorkPageContent } from "./WorkPageContent";
import { SITE_STATS } from "@/lib/site-stats";

export const metadata: Metadata = {
  title: "Projects",
  description: `${SITE_STATS.tools} AI tools, automation agents, and consultation services shipped in production.`,
};

export default function WorkPage() {
  return <WorkPageContent />;
}
