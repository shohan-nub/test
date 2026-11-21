import type { NextConfig } from "next";
import { siteOrigin } from "./src/app/site-metadata";

const wwwHost = `www.${new URL(siteOrigin).hostname}`;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: wwwHost.replaceAll(".", "\\.") }],
        destination: `${siteOrigin}/:path*`,
        permanent: true,
      },
    ];
  },
  /* config options here */
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      // Only this local asset folder needs content-version query strings.
      { pathname: "/seo-geo-showcase/*.webp" },
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
