import Prism from "prismjs";
import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";

import "prismjs/components/prism-jsx";
import "prismjs/components/prism-bash";

const usage_react_1 = "pnpm add @squircle-js/react";

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

const highlightedUsage1 =
  "bash" in Prism.languages
    ? Prism.highlight(usage_react_1, Prism.languages.bash, "bash")
    : "";

const highlightedUsage2 =
  "jsx" in Prism.languages
    ? Prism.highlight(usage_react_2, Prism.languages.jsx, "jsx")
    : "";

const highlightedUsage3 =
  "jsx" in Prism.languages
    ? Prism.highlight(usage_react_3, Prism.languages.jsx, "jsx")
    : "";

export const UsageSectionReactContent = () => {
  return (
    <Card className="w-full max-w-[480px] sm:max-w-[508px]">
      <CardContent className="w-full py-6">
        <h3 className="mb-2 font-semibold text-lg">
          Step 1. <span className="font-normal">Install the package.</span>
        </h3>
        <Code dangerousHTML={highlightedUsage1} raw={usage_react_1} />

        <h3 className="mt-4 mb-2 font-semibold text-lg">
          Step 2.{" "}
          <span className="font-normal">
            Import and use as a a regular div.
          </span>
        </h3>
        <Code dangerousHTML={highlightedUsage2} raw={usage_react_2} />

        <h3 className="mt-4 mb-2 font-semibold text-lg">
          Step 3.{" "}
          <span className="font-normal">
            Add global component for noscript support.
          </span>
        </h3>
        <Code dangerousHTML={highlightedUsage3} raw={usage_react_3} />
      </CardContent>
    </Card>
  );
};
