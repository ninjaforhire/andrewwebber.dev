import type { Metadata } from "next";
import { WorkPageContent } from "./WorkPageContent";

export const metadata: Metadata = {
  title: "Projects",
  description: "108 AI tools, automation agents, and consultation services shipped in production.",
};

export default function WorkPage() {
  return <WorkPageContent />;
}
