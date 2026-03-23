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
      <header className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Blog</h1>
        <p className="text-muted-foreground">
          Articles about squircles, smooth corners, and modern UI design.
        </p>
      </header>

      <div className="divide-y divide-border">
        {posts.map((post) => (
          <article className="py-6 first:pt-0 last:pb-0" key={post.slug}>
            <Link className="group block" href={`/blog/${post.slug}`}>
              <time className="text-muted-foreground text-sm">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="mt-1 font-semibold text-xl group-hover:text-blue-600">
                {post.title}
              </h2>
              <p className="mt-2 text-muted-foreground leading-7">
                {post.description}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
