import { ExternalLinkIcon } from "lucide-react";
import Prism from "prismjs";
import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";

import "prismjs/components/prism-bash";
import "prismjs/components/prism-jsx";

const usage_solid_1 = "pnpm add @squircle-js/solid";

const usage_solid_2 = `
import { Squircle } from "@squircle-js/solid";

export default function App() {
  return (
    <Squircle
      cornerRadius={10}
      cornerSmoothing={1}
      class="p-4 bg-black text-white"
    >
      Squircle!
    </Squircle>
  );
}
`.trim();

const usage_solid_3 = `
// app/root.tsx or near the app root
import { SquircleNoScript } from "@squircle-js/solid";

<SquircleNoScript />;
`.trim();

const highlightedUsage1 =
  "bash" in Prism.languages
    ? Prism.highlight(usage_solid_1, Prism.languages.bash, "bash")
    : "";

const highlightedUsage2 =
  "jsx" in Prism.languages
    ? Prism.highlight(usage_solid_2, Prism.languages.jsx, "jsx")
    : "";

const highlightedUsage3 =
  "jsx" in Prism.languages
    ? Prism.highlight(usage_solid_3, Prism.languages.jsx, "jsx")
    : "";

export const UsageSectionSolidContent = () => {
  return (
    <Card className="w-full max-w-120 sm:max-w-127">
      <CardContent className="w-full py-6">
        <h3 className="mb-2 font-semibold text-lg">
          Step 1.{" "}
          <span className="font-normal">
            Star this project{" "}
            <a
              className="text-blue-600 hover:underline"
              href="https://github.com/bring-shrubbery/squircle-js"
              rel="noreferrer noopener"
              target="_blank"
            >
              on Github.{" "}
              <ExternalLinkIcon className="mb-1 inline-block" size={16} />
            </a>
          </span>
        </h3>

        <h3 className="mb-2 font-semibold text-lg">
          Step 2. <span className="font-normal">Install the package.</span>
        </h3>
        <Code dangerousHTML={highlightedUsage1} raw={usage_solid_1} />

        <h3 className="mt-4 mb-2 font-semibold text-lg">
          Step 3.{" "}
          <span className="font-normal">Import and use in a component.</span>
        </h3>
        <Code dangerousHTML={highlightedUsage2} raw={usage_solid_2} />

        <h3 className="mt-4 mb-2 font-semibold text-lg">
          Step 4.{" "}
          <span className="font-normal">
            Add global component for noscript support.
          </span>
        </h3>
        <Code dangerousHTML={highlightedUsage3} raw={usage_solid_3} />
      </CardContent>
    </Card>
  );
};
