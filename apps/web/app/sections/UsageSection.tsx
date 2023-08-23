"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAtom } from "jotai";
import { LANGUAGE_SELECTOR_ATOM } from "@/lib/atoms";

export const UsageSection = ({
  reactUsageContent,
}: {
  reactUsageContent: JSX.Element;
}) => {
  const [language, setLanguage] = useAtom(LANGUAGE_SELECTOR_ATOM);

  return (
    <div className="mx-auto container w-full mb-36">
      <h2 className="font-semibold text-2xl mx-auto w-fit mb-4">
        How do I use it? 🤔
      </h2>

      <Tabs
        defaultValue="react"
        value={language}
        // TODO: Update this later when other languages are supported.
        onValueChange={(newLang) => setLanguage(newLang as "react")}
        className="w-full flex flex-col items-center"
      >
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
          {reactUsageContent}
        </TabsContent>
      </Tabs>
    </div>
  );
};
