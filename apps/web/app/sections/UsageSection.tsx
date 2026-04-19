"use client";

import { useAtom } from "jotai";
import Link from "next/link";
import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Framework, LANGUAGE_SELECTOR_ATOM } from "@/lib/atoms";

export const UsageSection = ({
  reactUsageContent,
  vueUsageContent,
  svelteUsageContent,
  solidUsageContent,
}: {
  reactUsageContent: ReactNode;
  vueUsageContent: ReactNode;
  svelteUsageContent: ReactNode;
  solidUsageContent: ReactNode;
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
        onValueChange={(newLang) => setLanguage(newLang as Framework)}
        value={language}
      >
        <TabsList>
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="vue">Vue</TabsTrigger>
          <TabsTrigger value="svelte">Svelte</TabsTrigger>
          <TabsTrigger value="solid">Solid</TabsTrigger>
        </TabsList>

        <TabsContent className="mx-auto w-fit" value="react">
          {reactUsageContent}
        </TabsContent>
        <TabsContent className="mx-auto w-fit" value="vue">
          {vueUsageContent}
        </TabsContent>
        <TabsContent className="mx-auto w-fit" value="svelte">
          {svelteUsageContent}
        </TabsContent>
        <TabsContent className="mx-auto w-fit" value="solid">
          {solidUsageContent}
        </TabsContent>
      </Tabs>

      <div className="mx-auto mt-6 w-fit">
        <Link
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="/docs"
        >
          {"Read the full docs →"}
        </Link>
      </div>
    </div>
  );
};
