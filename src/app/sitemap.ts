import type { MetadataRoute } from "next";
import { canonicalUrl, indexableRoutes, isVercelPreview } from "./site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isVercelPreview) return [];

  return indexableRoutes.map(path => ({
    url: canonicalUrl(path),
  }));
}
