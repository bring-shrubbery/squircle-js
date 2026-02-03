"use client";

import { useAtom } from "jotai";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LANGUAGE_SELECTOR_ATOM } from "@/lib/atoms";

export const UsageSection = ({
  reactUsageContent,
}: {
  reactUsageContent: ReactNode;
}) => {
  const [language, setLanguage] = useAtom(LANGUAGE_SELECTOR_ATOM);

  return (
    <div className="container mx-auto mb-36 w-full">
      <h2 className="mx-auto mb-4 w-fit font-semibold text-2xl">
        {"How do I use it? 🤔"}
      </h2>

      <Tabs
        className="flex w-full flex-col items-center"
        defaultValue="react"
        // TODO: Update this later when other languages are supported.
        onValueChange={(newLang) => setLanguage(newLang as "react")}
        value={language}
      >
        <TabsList>
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger disabled value="vue">
            Vue <Badge className="ml-2 hidden sm:block">soon</Badge>
          </TabsTrigger>
          <TabsTrigger disabled value="svelte">
            Svelte <Badge className="ml-2 hidden sm:block">soon</Badge>
          </TabsTrigger>
          <TabsTrigger disabled value="solid">
            Solid <Badge className="ml-2 hidden sm:block">soon</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent className="mx-auto w-fit" value="react">
          {reactUsageContent}
        </TabsContent>
      </Tabs>
    </div>
  );
};
