"use client";

import { CopyIcon } from "lucide-react";

import { ScrollArea } from "./scroll-area";
import { useToast } from "./use-toast";

export const Code = ({
  dangerousHTML,
  raw,
}: {
  dangerousHTML: string;
  raw: string;
}) => {
  const toast = useToast();

  const copyContent = raw;

  return (
    <code className="relative inline-flex w-full items-center space-x-4 rounded-lg bg-primary p-4 pl-6 pr-14 text-left text-sm text-primary-foreground sm:text-base">
      <ScrollArea orientation="horizontal" className="w-full">
        <pre
          className="w-fit"
          dangerouslySetInnerHTML={{ __html: dangerousHTML }}
        />
      </ScrollArea>

      <button
        className="absolute right-2 top-2.5 flex h-8 w-8 items-center justify-center p-0.5"
        onClick={() => {
          navigator.clipboard.writeText(copyContent).catch(console.error);
          toast.toast({
            title: "Code copied!",
          });
        }}
      >
        <CopyIcon size={18} />
      </button>
    </code>
  );
};
