import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account/",
        "/admin/",
        "/studio/",
        "/api/",
        "/inquiry",
        "/preview",
        "/coming-soon",
      ],
    },
    sitemap: "https://www.elgatonegro.coffee/sitemap.xml",
  };
}
