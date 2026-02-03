"use client";

import { Squircle } from "@squircle-js/react";
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
    <Squircle asChild cornerRadius={16} cornerSmoothing={1}>
      <code className="relative inline-flex w-full items-center space-x-4 bg-primary p-4 pr-14 pl-6 text-left text-primary-foreground text-sm sm:text-base">
        <ScrollArea className="w-full" orientation="horizontal">
          <pre
            className="w-fit"
            dangerouslySetInnerHTML={{ __html: dangerousHTML }}
          />
        </ScrollArea>

        <button
          className="absolute top-2.5 right-2 flex h-8 w-8 items-center justify-center p-0.5"
          onClick={() => {
            navigator.clipboard.writeText(copyContent).catch(console.error);
            toast.toast({
              title: "Code copied!",
            });
          }}
          type="button"
        >
          <CopyIcon size={18} />
        </button>
      </code>
    </Squircle>
  );
};
