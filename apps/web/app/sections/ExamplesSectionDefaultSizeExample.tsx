import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";
import { Squircle } from "@squircle-js/react";

import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import { ExamplesSectionDefaultSizeExampleClientComponent } from "./ExamplesSectionDefaultSizeExampleClientComponent";

const usage = `<Squircle
  cornerRadius={64}
  cornerSmoothing={1}
  defaultSize={256}
  defaultSize={256}
>
  <div
    className="w-full h-full
    bg-gradient-to-br from-indigo-500
    via-purple-500 to-pink-500"
  />
</Squircle>`;

const highlightedUsage = Prism.highlight(
  ["...", usage, "..."].join("\n"),
  Prism.languages.jsx,
  "jsx"
);

export const ExamplesSectionDefaultSizeExample = () => {
  return (
    <Card className="w-full max-w-[480px] sm:max-w-[508px]">
      <CardContent className="py-6 w-full space-y-4">
        <h3 className="font-semibold text-lg">Code:</h3>
        <p>
          For images to work you will need to provide either default size, or
          specific size you want the image to be.
        </p>
        <Code dangerousHTML={highlightedUsage} raw={usage} />
        <h3 className="font-semibold text-lg">Result:</h3>

        <ExamplesSectionDefaultSizeExampleClientComponent />
      </CardContent>
    </Card>
  );
};
