import type { Metadata } from "next";
import OpeningLoader from "./components/OpeningLoader";
import { siteOrigin, siteSocialImage } from "./site-metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteOrigin ? new URL(siteOrigin) : undefined,
  alternates: siteOrigin ? { canonical: new URL("/", siteOrigin).href } : undefined,
  icons: {
    icon: "/sparklab-icon-clear.svg",
    shortcut: "/sparklab-icon-clear.svg",
    apple: "/sparklab-icon-clear.png",
  },
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
    url: siteOrigin ? new URL("/", siteOrigin).href : undefined,
    images: siteSocialImage ? [{ url: siteSocialImage, alt: "SparkLab emblem" }] : undefined,
  },
  twitter: {
    card: siteSocialImage ? "summary_large_image" : "summary",
    title: "Spark Lab | Digital Experiences & AI Solutions",
    description:
      "Modern websites, powerful software, and intelligent AI automation by Spark Lab.",
    images: siteSocialImage ? [siteSocialImage] : undefined,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><OpeningLoader />{children}</body>
    </html>
  );
}
