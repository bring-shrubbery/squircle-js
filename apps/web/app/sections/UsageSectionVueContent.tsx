import { ExternalLinkIcon } from "lucide-react";
import Prism from "prismjs";
import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";

import "prismjs/components/prism-bash";
import "prismjs/components/prism-markup";

const usage_vue_1 = "pnpm add @squircle-js/vue";

const usage_vue_2 = `
<script setup>
import { Squircle } from "@squircle-js/vue";
</script>

<template>
  <Squircle
    :corner-radius="10"
    :corner-smoothing="1"
    class="p-4 bg-black text-white"
  >
    Squircle!
  </Squircle>
</template>
`.trim();

const usage_vue_3 = `
<!-- App.vue or root-level layout -->
<script setup>
import { SquircleNoScript } from "@squircle-js/vue";
</script>

<template>
  <SquircleNoScript />
  <!-- ... -->
</template>
`.trim();

const highlightedUsage1 =
  "bash" in Prism.languages
    ? Prism.highlight(usage_vue_1, Prism.languages.bash, "bash")
    : "";

const highlightedUsage2 =
  "markup" in Prism.languages
    ? Prism.highlight(usage_vue_2, Prism.languages.markup, "markup")
    : "";

const highlightedUsage3 =
  "markup" in Prism.languages
    ? Prism.highlight(usage_vue_3, Prism.languages.markup, "markup")
    : "";

export const UsageSectionVueContent = () => {
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
        <Code dangerousHTML={highlightedUsage1} raw={usage_vue_1} />

        <h3 className="mt-4 mb-2 font-semibold text-lg">
          Step 3.{" "}
          <span className="font-normal">Import and use in a template.</span>
        </h3>
        <Code dangerousHTML={highlightedUsage2} raw={usage_vue_2} />

        <h3 className="mt-4 mb-2 font-semibold text-lg">
          Step 4.{" "}
          <span className="font-normal">
            Add global component for noscript support.
          </span>
        </h3>
        <Code dangerousHTML={highlightedUsage3} raw={usage_vue_3} />
      </CardContent>
    </Card>
  );
};
