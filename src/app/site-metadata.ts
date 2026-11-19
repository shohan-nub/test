import type { Metadata } from "next";

function productionOrigin() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "");
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    if (/^(?:localhost|0\.0\.0\.0|\[::1\])$|^127\.|\.localhost$/i.test(url.hostname)) return undefined;
    if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export const siteOrigin = productionOrigin();
export const siteSocialImage = siteOrigin ? new URL("/sparklab-icon-clear.png", siteOrigin).href : undefined;

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = siteOrigin ? new URL(path, siteOrigin).href : undefined;
  const socialTitle = `${title} | Spark Lab`;

  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: socialTitle,
      description,
      siteName: "Spark Lab",
      type: "website",
      url,
      images: siteSocialImage ? [{ url: siteSocialImage, alt: "SparkLab emblem" }] : undefined,
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
      images: siteSocialImage ? [siteSocialImage] : undefined,
    },
  };
}
