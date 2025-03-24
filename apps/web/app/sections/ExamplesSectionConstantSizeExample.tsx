import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";
import { Squircle } from "@squircle-js/react";
import Prism from "prismjs";

import "prismjs/components/prism-jsx";

import type { PropsWithChildren } from "react";

const usage = `<Squircle
  cornerRadius={64}
  cornerSmoothing={1}
  width={256}
  height={256}
>
  <div
    className="w-full h-full
    bg-gradient-to-br from-indigo-500
    via-purple-500 to-pink-500"
  />
</Squircle>`;

const highlightedUsage =
  "jsx" in Prism.languages
    ? Prism.highlight(
        ["...", usage, "..."].join("\n"),
        Prism.languages.jsx,
        "jsx",
      )
    : "";

export const ExampleSectionConstantSizeExample = () => {
  return (
    <Card className="w-full max-w-[480px] sm:max-w-[508px]">
      <CardContent className="w-full space-y-4 py-6">
        <h3 className="text-lg font-semibold">Code:</h3>

        <p>
          When you know the exact size you want your squircle to be, you can use{" "}
          <Kode>width</Kode> and <Kode>height</Kode> props to specify it. This
          is especially useful when you Server Side Render your app, and you
          know the size of the image you want to squircle.
        </p>

        <Code dangerousHTML={highlightedUsage} raw={usage} />
        <h3 className="text-lg font-semibold">Result:</h3>

        <Squircle
          cornerRadius={64}
          cornerSmoothing={1}
          width={256}
          height={256}
          className="mx-auto"
        >
          <div className="h-full w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
        </Squircle>
      </CardContent>
    </Card>
  );
};

const Kode = ({ children }: PropsWithChildren) => (
  <code className="rounded-md bg-slate-200/50 px-1.5 py-0.5 text-sm">
    {children}
  </code>
);
