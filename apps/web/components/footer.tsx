import Link from "next/link";
import { getAllContent } from "@/lib/mdx";

export const Footer = () => {
  const blogPosts = getAllContent("blog");
  const docPages = getAllContent("docs");

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Blog
            </h3>
            <ul className="space-y-2">
              {blogPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href={`/blog/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Docs
            </h3>
            <ul className="space-y-2">
              {docPages.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href={`/docs/${doc.slug}`}
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
