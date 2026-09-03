import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stackcircuit.dev"),
  title: {
    default: "StackCircuit365",
    template: "%s // StackCircuit365"
  },
  description:
    "StackCircuit365 catches a bad GitHub to Vercel deployment, restores your last verified healthy release under rules you set, and prepares the repair. Free forever for developers.",
  keywords: [
    "StackCircuit365",
    "Vercel rollback",
    "release safety",
    "deployment monitoring",
    "Next.js",
    "GitHub"
  ],
  openGraph: {
    title: "StackCircuit365",
    description:
      "Every release has a safety circuit. Detect bad deployments, restore the last verified healthy release under your rules, prepare the repair.",
    url: "https://stackcircuit.dev",
    siteName: "StackCircuit365",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
