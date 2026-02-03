"use client";

import { useAtom } from "jotai";
import type { JSX } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LANGUAGE_SELECTOR_ATOM } from "@/lib/atoms";

export const ExamplesSection = ({
  constantSizeExample,
  defaultSizeExample,
  asChildPropExample,
  dynamicSizeExample,
}: {
  constantSizeExample: JSX.Element;
  defaultSizeExample: JSX.Element;
  asChildPropExample: JSX.Element;
  dynamicSizeExample: JSX.Element;
}) => {
  const [language] = useAtom<"react" | "svelte">(LANGUAGE_SELECTOR_ATOM);

  const langLabel = language === "react" ? "React" : "";

  return (
    <div className="container mx-auto mb-36 w-fit">
      <h2 className="mx-auto mb-4 w-fit font-semibold text-2xl">
        {`More ${langLabel} examples 🎒`}
      </h2>

      <Tabs className="flex w-full flex-col items-center" defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">{"Constant size"}</TabsTrigger>
          <TabsTrigger value="2">{"Default size (Image Example)"}</TabsTrigger>
          <TabsTrigger value="3">{"asChild prop"}</TabsTrigger>
          <TabsTrigger value="4">{"Dynamic size"}</TabsTrigger>
        </TabsList>

        <TabsContent value="1">{constantSizeExample}</TabsContent>
        <TabsContent value="2">{defaultSizeExample}</TabsContent>
        <TabsContent value="3">{asChildPropExample}</TabsContent>
        <TabsContent value="4">{dynamicSizeExample}</TabsContent>
      </Tabs>
    </div>
  );
};
