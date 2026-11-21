import type { MetadataRoute } from "next";
import { isVercelPreview, siteOrigin } from "./site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: isVercelPreview ? undefined : new URL("/sitemap.xml", siteOrigin).href,
  };
}
