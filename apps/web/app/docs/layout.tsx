import { DocsSidebar } from "@/components/docs-sidebar";
import { Footer } from "@/components/footer";
import { getAllContent } from "@/lib/mdx";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docsItems = getAllContent("docs");

  return (
    <>
      <div className="mx-auto flex max-w-4xl gap-8 px-6 py-16">
        <DocsSidebar items={docsItems} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <Footer />
    </>
  );
}
