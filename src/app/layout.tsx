import type { Metadata } from "next";
import OpeningLoader from "./components/OpeningLoader";
import { isVercelPreview, pageMetadata, siteOrigin } from "./site-metadata";
import "./globals.css";

const homeTitle = "Spark Lab | Digital Experiences & AI Solutions";
const homeDescription = "Spark Lab designs and builds modern websites, web applications, e-commerce experiences, and intelligent AI automation solutions for ambitious businesses.";

export const metadata: Metadata = {
  ...pageMetadata("/", homeTitle, homeDescription),
  metadataBase: new URL(siteOrigin),
  robots: isVercelPreview ? { index: false, follow: false } : undefined,
  icons: {
    icon: "/sparklab-icon-clear.svg",
    shortcut: "/sparklab-icon-clear.svg",
    apple: "/sparklab-icon-clear.png",
  },
  title: {
    default: homeTitle,
    template: "%s | Spark Lab",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><OpeningLoader />{children}</body>
    </html>
  );
}
