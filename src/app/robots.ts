import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seoEngine";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot", "DuckDuckBot"],
        allow: "/",
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended"],
        allow: "/",
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
