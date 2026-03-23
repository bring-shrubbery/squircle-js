// TODO: uncomment when Footer component is created in Task 8
// import { Footer } from "@/components/footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto max-w-2xl px-6 py-16">
        {children}
      </div>
      {/* <Footer /> */}
    </>
  );
}
