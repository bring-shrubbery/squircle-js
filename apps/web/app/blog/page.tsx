import type { Metadata } from "next";
import Link from "next/link";
import { getAllContent } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog - Squircle.js",
  description:
    "Articles about squircles, smooth corners, superellipses, and modern UI design.",
  alternates: { canonical: "https://squircle.js.org/blog" },
};

export default function BlogIndex() {
  const posts = getAllContent("blog");

  return (
    <>
      <h1 className="mb-8 font-bold text-3xl">Blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link className="group block" href={`/blog/${post.slug}`}>
              <h2 className="mb-1 font-semibold text-xl group-hover:text-blue-600">
                {post.title}
              </h2>
              <time className="mb-2 block text-muted-foreground text-sm">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <p className="text-muted-foreground">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
