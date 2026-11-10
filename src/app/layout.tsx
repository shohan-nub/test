import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Spark Lab | Digital Experiences & AI Solutions",
    template: "%s | Spark Lab",
  },
  description:
    "Spark Lab designs and builds modern websites, web applications, e-commerce experiences, and intelligent AI automation solutions for ambitious businesses.",
  openGraph: {
    title: "Spark Lab | Digital Experiences & AI Solutions",
    description:
      "We create modern websites, powerful software, and intelligent automation that help businesses grow.",
    siteName: "Spark Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spark Lab | Digital Experiences & AI Solutions",
    description:
      "Modern websites, powerful software, and intelligent AI automation by Spark Lab.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
