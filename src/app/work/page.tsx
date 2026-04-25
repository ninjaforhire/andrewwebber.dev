import type { Metadata } from "next";
import { WorkPageContent } from "./WorkPageContent";

export const metadata: Metadata = {
  title: "Work",
  description: "170+ AI tools, automation agents, and consultation services.",
};

export default function WorkPage() {
  return <WorkPageContent />;
}
