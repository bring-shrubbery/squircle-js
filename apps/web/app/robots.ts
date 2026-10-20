import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/llms.txt"],
    },
    sitemap: "https://squircle.js.org/sitemap.xml",
  };
}
