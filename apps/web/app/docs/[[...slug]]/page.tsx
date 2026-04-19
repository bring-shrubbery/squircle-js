import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsFeedback } from "@/components/docs-feedback";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { compileMdx, getAllContent, getContentBySlug } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  const docs = getAllContent("docs");
  return [{ slug: [] }, ...docs.map((doc) => ({ slug: [doc.slug] }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const docSlug = slug?.[0] ?? "getting-started";

  try {
    const { frontmatter } = getContentBySlug("docs", docSlug);
    return {
      title: `${frontmatter.title} - Squircle.js Docs`,
      description: frontmatter.description,
      keywords: frontmatter.keywords,
      alternates: {
        canonical: slug?.length
          ? `https://squircle.js.org/docs/${docSlug}`
          : "https://squircle.js.org/docs",
      },
    };
  } catch {
    return {};
  }
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  const docSlug = slug?.[0] ?? "getting-started";

  const doc = (() => {
    try {
      return getContentBySlug("docs", docSlug);
    } catch {
      notFound();
    }
  })();

  const Content = await compileMdx(doc.content, mdxComponents);

  return (
    <article>
      <h1 className="mb-6 font-bold text-3xl">{doc.frontmatter.title}</h1>
      <Content />

      <DocsFeedback />

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: doc.frontmatter.title,
            description: doc.frontmatter.description,
            author: {
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
