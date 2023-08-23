import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";

import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-bash";

const usage_react_1 = `pnpm add @squircle-js/react`;

const usage_react_2 = `
import { Squircle }
  from "@squircle-js/react"

const YourComponent = () => {
  return <Squircle
    cornerRadius={10}
    cornerSmoothing={1}
    className="p-4 bg-black text-white"
  >
    Squircle!
  </Squircle>
}
`.trim();

const usage_react_3 = `
// _app.tsx or root-level layout.tsx
import { SquircleNoScript } from "@squircle-js/react";

...
<SquircleNoScript />
...
`.trim();

const highlightedUsage1 = Prism.highlight(
  usage_react_1,
  Prism.languages.bash,
  "bash"
);

const highlightedUsage2 = Prism.highlight(
  usage_react_2,
  Prism.languages.jsx,
  "jsx"
);

const highlightedUsage3 = Prism.highlight(
  usage_react_3,
  Prism.languages.jsx,
  "jsx"
);

export const UsageSectionReactContent = () => {
  return (
    <Card className="w-full max-w-[480px] sm:max-w-[508px]">
      <CardContent className="py-6 w-full">
        <h3 className="font-semibold text-lg mb-2">
          Step 1. <span className="font-normal">Install the package.</span>
        </h3>
        <Code dangerousHTML={highlightedUsage1} raw={usage_react_1} />

        <h3 className="font-semibold text-lg mb-2 mt-4">
          Step 2.{" "}
          <span className="font-normal">
            Import and use as a a regular div.
          </span>
        </h3>
        <Code raw={usage_react_2} dangerousHTML={highlightedUsage2} />

        <h3 className="font-semibold text-lg mb-2 mt-4">
          Step 3.{" "}
          <span className="font-normal">
            Add global component for noscript support.
          </span>
        </h3>
        <Code raw={usage_react_3} dangerousHTML={highlightedUsage3} />
      </CardContent>
    </Card>
  );
};
