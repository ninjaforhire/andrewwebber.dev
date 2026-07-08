import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QBO OAuth Callback",
  robots: { index: false, follow: false },
};

export default function QboCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
