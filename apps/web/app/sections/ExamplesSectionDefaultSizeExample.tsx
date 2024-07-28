import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";
import Prism from "prismjs";

import "prismjs/components/prism-jsx";

import type { PropsWithChildren } from "react";

import { ExamplesSectionDefaultSizeExampleClientComponent } from "./ExamplesSectionDefaultSizeExampleClientComponent";

const usage = `<Squircle
  cornerRadius={50}
  cornerSmoothing={1}
  defaultWidth={320}
  defaultHeight={214}
  className="bg-slate-100 w-fit h-fit"
  asChild
>
  <Image
    src="/antoni-silvestrovic-baS2vUSSGBY-unsplash.jpg"
    width={320}
    height={214}
    alt="D*ck"
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

export const ExamplesSectionDefaultSizeExample = () => {
  return (
    <Card className="w-full max-w-[480px] sm:max-w-[508px]">
      <CardContent className="w-full space-y-4 py-6">
        <h3 className="text-lg font-semibold">Code:</h3>
        <p>
          For images to work you will need to provide either default size, or
          specific size you want the image to be.
        </p>
        <p>
          In this example, we&apos;re using <Kode>defaultWidth</Kode> and{" "}
          <Kode>defaultHeight</Kode> to tell Squircle what size we want the{" "}
          <Kode>clipPath</Kode> to be initially, afterwards if you resize the
          image it will be updated automatically.
        </p>
        <Code dangerousHTML={highlightedUsage} raw={usage} />
        <h3 className="text-lg font-semibold">Result:</h3>

        <ExamplesSectionDefaultSizeExampleClientComponent />
      </CardContent>
    </Card>
  );
};

const Kode = ({ children }: PropsWithChildren) => (
  <code className="rounded-md bg-slate-200/50 px-1.5 py-0.5 text-sm">
    {children}
  </code>
);
