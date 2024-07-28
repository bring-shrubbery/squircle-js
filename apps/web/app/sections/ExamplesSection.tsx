"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LANGUAGE_SELECTOR_ATOM } from "@/lib/atoms";
import { useAtom } from "jotai";

export const ExamplesSection = ({
  constantSizeExample,
  defaultSizeExample,
  asChildPropExample,
}: {
  constantSizeExample: JSX.Element;
  defaultSizeExample: JSX.Element;
  asChildPropExample: JSX.Element;
}) => {
  const [language] = useAtom<"react" | "svelte">(LANGUAGE_SELECTOR_ATOM);

  const langLabel = language === "react" ? "React" : "";

  return (
    <div className="container mx-auto mb-36 w-fit">
      <h2 className="mx-auto mb-4 w-fit text-2xl font-semibold">
        {`More ${langLabel} examples 🎒`}
      </h2>

      <Tabs defaultValue="1" className="flex w-full flex-col items-center">
        <TabsList>
          <TabsTrigger value="1">{"Constant size"}</TabsTrigger>
          <TabsTrigger value="2">{"Default size (Image Example)"}</TabsTrigger>
          <TabsTrigger value="3">{"asChild prop"}</TabsTrigger>
        </TabsList>

        <TabsContent value="1">{constantSizeExample}</TabsContent>
        <TabsContent value="2">{defaultSizeExample}</TabsContent>
        <TabsContent value="3">{asChildPropExample}</TabsContent>
      </Tabs>
    </div>
  );
};
