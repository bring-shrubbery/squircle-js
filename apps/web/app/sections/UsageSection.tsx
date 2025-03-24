"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LANGUAGE_SELECTOR_ATOM } from "@/lib/atoms";
import { useAtom } from "jotai";

export const UsageSection = ({
  reactUsageContent,
}: {
  reactUsageContent: ReactNode;
}) => {
  const [language, setLanguage] = useAtom(LANGUAGE_SELECTOR_ATOM);

  return (
    <div className="container mx-auto mb-36 w-full">
      <h2 className="mx-auto mb-4 w-fit text-2xl font-semibold">
        {"How do I use it? 🤔"}
      </h2>

      <Tabs
        defaultValue="react"
        value={language}
        // TODO: Update this later when other languages are supported.
        onValueChange={(newLang) => setLanguage(newLang as "react")}
        className="flex w-full flex-col items-center"
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

        <TabsContent value="react" className="mx-auto w-fit">
          {reactUsageContent}
        </TabsContent>
      </Tabs>
    </div>
  );
};
