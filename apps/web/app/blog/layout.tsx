import { Navbar } from "@/components/navbar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar className="max-w-2xl" />
      <div className="mx-auto max-w-2xl px-6 py-16">{children}</div>
    </>
  );
}
