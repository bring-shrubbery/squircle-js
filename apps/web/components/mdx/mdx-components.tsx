import type { ComponentPropsWithoutRef } from "react";
import { CodeBlock } from "./code-block";
import { SquircleComparison } from "./squircle-comparison";
import { SquircleDemo } from "./squircle-demo";

export const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mb-4 font-bold text-3xl" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-8 mb-4 font-semibold text-2xl" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-6 mb-3 font-semibold text-xl" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 leading-7" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 list-inside list-disc space-y-2" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-4 list-inside list-decimal space-y-2" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-7" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-blue-600 underline underline-offset-4 hover:text-blue-800"
      {...props}
    />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mb-4 border-muted border-l-4 pl-4 italic"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
      {...props}
    />
  ),
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => {
    const codeElement = children as React.ReactElement<{
      children: string;
      className?: string;
    }>;
    if (codeElement?.props) {
      return (
        <CodeBlock className={codeElement.props.className}>
          {codeElement.props.children}
        </CodeBlock>
      );
    }
    return (
      <pre
        className="mb-4 overflow-x-auto rounded-lg bg-primary p-4 text-primary-foreground text-sm"
        {...props}
      >
        {children}
      </pre>
    );
  },
  hr: () => <hr className="my-8 border-border" />,
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border border-border px-4 py-2 text-left font-semibold"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border border-border px-4 py-2" {...props} />
  ),
  SquircleDemo,
  SquircleComparison,
};
