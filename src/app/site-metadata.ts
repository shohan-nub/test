import type { Metadata } from "next";
import { siteOrigin } from "./site-origin.mjs";

export { siteOrigin };
export const isVercelPreview = process.env.VERCEL_ENV === "preview";
export const indexableRoutes = ["/", "/about", "/services", "/approach", "/contact"] as const;
type IndexableRoute = (typeof indexableRoutes)[number];

export const siteName = "SparkLab";
const socialImage = {
  url: new URL("/sparklab-mark-512.png", siteOrigin).href,
  width: 512,
  height: 512,
  alt: "SparkLab emblem",
};

export function canonicalUrl(path: IndexableRoute) {
  return path === "/" ? siteOrigin : new URL(path, siteOrigin).href;
}

export function pageMetadata(
  path: IndexableRoute,
  title: string,
  description: string,
  { absoluteTitle = false } = {},
): Metadata {
  const url = canonicalUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      siteName,
      type: "website",
      url,
      images: [socialImage],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
      images: [socialImage],
    },
  };
}
