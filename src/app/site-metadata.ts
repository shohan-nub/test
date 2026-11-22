import type { Metadata } from "next";

export const siteOrigin = "https://sparklabltd.com";
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

export function pageMetadata(path: IndexableRoute, title: string, description: string): Metadata {
  const url = canonicalUrl(path);
  const socialTitle = path === "/" ? title : `${title} | ${siteName}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      siteName,
      type: "website",
      url,
      images: [socialImage],
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
      images: [socialImage],
    },
  };
}
