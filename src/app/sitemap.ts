import type { MetadataRoute } from "next";
import { siteOrigin } from "./site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) return [];

  return ["/", "/services", "/about", "/contact"].map(path => ({
    url: new URL(path, siteOrigin).href,
  }));
}
