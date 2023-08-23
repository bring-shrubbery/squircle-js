"use client";

import { CopyIcon } from "lucide-react";
import { useToast } from "./use-toast";
import { ScrollArea } from "./scroll-area";

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
    <code className="relative text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-primary text-primary-foreground rounded-lg p-4 pl-6 pr-14 w-full">
      <ScrollArea orientation="horizontal" className="w-full">
        <pre
          className="w-fit"
          dangerouslySetInnerHTML={{ __html: dangerousHTML }}
        />
      </ScrollArea>

      <button
        className="p-0.5 absolute right-2 flex items-center justify-center h-8 w-8 top-2.5"
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
