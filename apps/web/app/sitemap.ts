import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getAllContent("blog");
  const docPages = getAllContent("docs");

  return [
    {
      url: "https://squircle.js.org/",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://squircle.js.org/blog",
      lastModified: new Date(),
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `https://squircle.js.org/blog/${post.slug}`,
      lastModified: new Date(post.date),
      priority: 0.7,
    })),
    {
      url: "https://squircle.js.org/docs",
      lastModified: new Date(),
      priority: 0.8,
    },
    ...docPages.map((doc) => ({
      url: `https://squircle.js.org/docs/${doc.slug}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
  ];
}
