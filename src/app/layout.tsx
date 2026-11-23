import type { Metadata } from "next";
import OpeningLoader from "./components/OpeningLoader";
import { isVercelPreview, siteOrigin } from "./site-metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  robots: isVercelPreview ? { index: false, follow: false } : undefined,
  icons: {
    icon: { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
    apple: { url: "/sparklab-mark-180.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><OpeningLoader />{children}</body>
    </html>
  );
}
