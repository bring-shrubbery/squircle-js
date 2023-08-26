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
  const [language] = useAtom(LANGUAGE_SELECTOR_ATOM);

  const langLabel = language === "react" ? "React" : "";

  return (
    <div className="mx-auto container w-fit mb-36">
      <h2 className="font-semibold text-2xl mx-auto w-fit mb-4">
        More {langLabel} examples 🎒
      </h2>

      <Tabs defaultValue="1" className="w-full flex flex-col items-center">
        <TabsList>
          <TabsTrigger value="1">Constant size</TabsTrigger>
          <TabsTrigger value="2">Default size (Image Example)</TabsTrigger>
          <TabsTrigger value="3">asChild prop</TabsTrigger>
        </TabsList>

        <TabsContent value="1">{constantSizeExample}</TabsContent>
        <TabsContent value="2">{defaultSizeExample}</TabsContent>
        <TabsContent value="3">{asChildPropExample}</TabsContent>
      </Tabs>
    </div>
  );
};
