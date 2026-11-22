import type { Metadata } from "next";
import OpeningLoader from "./components/OpeningLoader";
import { isVercelPreview, pageMetadata, siteName, siteOrigin } from "./site-metadata";
import "./globals.css";

const homeTitle = `${siteName} | Digital Experiences & AI Solutions`;
const homeDescription = `${siteName} designs and builds modern websites, web applications, e-commerce experiences, and intelligent AI automation solutions for ambitious businesses.`;

export const metadata: Metadata = {
  ...pageMetadata("/", homeTitle, homeDescription),
  metadataBase: new URL(siteOrigin),
  robots: isVercelPreview ? { index: false, follow: false } : undefined,
  icons: {
    icon: { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
    apple: { url: "/sparklab-mark-180.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/site.webmanifest",
  title: {
    default: homeTitle,
    template: `%s | ${siteName}`,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><OpeningLoader />{children}</body>
    </html>
  );
}
