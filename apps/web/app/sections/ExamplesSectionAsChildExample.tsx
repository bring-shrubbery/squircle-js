import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";
import { Squircle } from "@squircle-js/react";

import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import type { PropsWithChildren } from "react";

const usage = `<Squircle
  asChild
  cornerRadius={10}
  cornerSmoothing={1}
  className="bg-black text-white px-2 py-1"
>
  <span>Inline Squircle</span>
</Squircle>`;

const highlightedUsage = "jsx" in Prism.languages ? Prism.highlight(
  ["...", usage, "..."].join("\n"),
  Prism.languages.jsx,
  "jsx"
) : "";

export const ExamplesSectionAsChildExample = () => {
  return (
    <Card className="w-full max-w-[480px] sm:max-w-[508px]">
      <CardContent className="py-6 w-full space-y-4">
        <h3 className="font-semibold text-lg">Code:</h3>
        <p>
          You can use <Kode>asChild</Kode> prop to squircle any element. This is
          useful when you want to squircle some element that might change size.
          By default <Kode>Squircle</Kode> is a <Kode>div</Kode> element, but
          you can change it to any other element by nesting that element inside
          of <Kode>Squircle</Kode> component and adding <Kode>asChild</Kode>{" "}
          prop.
        </p>

        <Code dangerousHTML={highlightedUsage} raw={usage} />
        <h3 className="font-semibold text-lg">Result:</h3>

        <Squircle
          cornerRadius={10}
          cornerSmoothing={1}
          asChild
          className="bg-black text-white px-2 py-1"
        >
          <span>Inline Squircle</span>
        </Squircle>
      </CardContent>
    </Card>
  );
};

const Kode = ({ children }: PropsWithChildren) => (
  <code className="bg-slate-200/50 px-1.5 text-sm py-0.5 rounded-md">
    {children}
  </code>
);
