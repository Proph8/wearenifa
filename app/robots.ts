import type { MetadataRoute } from "next";

const site = process.env.SITE_URL ?? "https://wearnifa.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/keystatic", "/api/", "/sign-in"] }],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
