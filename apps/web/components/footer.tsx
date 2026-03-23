import Link from "next/link";
import { getAllContent } from "@/lib/mdx";

export const Footer = () => {
  const blogPosts = getAllContent("blog");
  const docPages = getAllContent("docs");

  return (
    <footer className="border-border border-t">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
              Blog
            </h3>
            <ul className="space-y-2">
              {blogPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href={`/blog/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
              Docs
            </h3>
            <ul className="space-y-2">
              {docPages.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
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
