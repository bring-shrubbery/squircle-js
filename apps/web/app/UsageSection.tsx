import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Code } from "@/components/ui/code";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export const UsageSection = () => {
  return (
    <div className="mx-auto container w-full mb-36">
      <h2 className="font-semibold text-2xl mx-auto w-fit mb-4">
        How do I use it? 🤔
      </h2>

      <Tabs defaultValue="react" className="w-full flex flex-col items-center">
        <TabsList>
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="vue" disabled>
            Vue <Badge className="ml-2 hidden sm:block">soon</Badge>
          </TabsTrigger>
          <TabsTrigger value="svelte" disabled>
            Svelte <Badge className="ml-2 hidden sm:block">soon</Badge>
          </TabsTrigger>
          <TabsTrigger value="solid" disabled>
            Solid <Badge className="ml-2 hidden sm:block">soon</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="react" className="w-fit mx-auto">
          <Card className="w-full max-w-[480px] sm:max-w-[508px]">
            <CardContent className="py-6 w-full">
              <h3 className="font-semibold text-lg mb-2">
                Step 1.{" "}
                <span className="font-normal">Install the package.</span>
              </h3>
              <Code content="pnpm add @squircle-js/react" />

              <h3 className="font-semibold text-lg mb-2 mt-4">
                Step 2.{" "}
                <span className="font-normal">
                  Import and use as a a regular div.
                </span>
              </h3>
              <Code raw={usage_react_2} content={<pre>{usage_react_2}</pre>} />

              <h3 className="font-semibold text-lg mb-2 mt-4">
                Step 3.{" "}
                <span className="font-normal">
                  Add global component for noscript.
                </span>
              </h3>
              <Code raw={usage_react_3} content={<pre>{usage_react_3}</pre>} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
