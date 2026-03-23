import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { compileMdx, getAllContent, getContentBySlug } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const posts = getAllContent("blog");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getContentBySlug("blog", slug);
    return {
      title: `${frontmatter.title} - Squircle.js`,
      description: frontmatter.description,
      keywords: frontmatter.keywords,
      alternates: {
        canonical: `https://squircle.js.org/blog/${slug}`,
      },
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.description,
        type: "article",
        publishedTime: frontmatter.date,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  const post = (() => {
    try {
      return getContentBySlug("blog", slug);
    } catch {
      notFound();
    }
  })();

  const Content = await compileMdx(post.content, mdxComponents);

  return (
    <article>
      <header className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">{post.frontmatter.title}</h1>
        <time className="text-muted-foreground text-sm">
          {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      <Content />

      <div className="mt-12 border-border border-t pt-6">
        <Link className="text-blue-600 hover:text-blue-800" href="/blog">
          Back to all posts
        </Link>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.frontmatter.title,
            description: post.frontmatter.description,
            datePublished: post.frontmatter.date,
            author: {
              "@type": "Person",
              name: "Antoni Silvestrovic",
            },
            publisher: {
              "@type": "Organization",
              name: "Squircle.js",
              url: "https://squircle.js.org",
            },
          }),
        }}
        type="application/ld+json"
      />
    </article>
  );
}
