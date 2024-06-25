import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://squircle.js.org/",
      lastModified: new Date(),
      priority: 1,
    },
  ];
}
