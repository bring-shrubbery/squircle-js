"use client";

import { Button } from "@/components/ui/button";
import { Squircle } from "@squircle-js/react";
import { RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const ExamplesSectionDefaultSizeExampleClientComponent = () => {
  const [src, setSrc] = useState("");

  const handleRefetchImage = () => {
    setSrc("");

    const timeout = setTimeout(() => {
      setSrc("/antoni-silvestrovic-baS2vUSSGBY-unsplash.jpg");
    }, 1000);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    handleRefetchImage();
  }, []);

  return (
    <div className="space-y-4 flex flex-col items-center">
      <Button variant="outline" onClick={handleRefetchImage}>
        <RotateCcwIcon className={"w-4 h-4 mr-2"} />
        Refetch Image
      </Button>
      {src && (
        <Squircle
          cornerRadius={64}
          cornerSmoothing={1}
          // width={256}
          // height={256}
          defaultWidth={256}
          defaultHeight={256}
          className="bg-slate-100 w-fit h-fit"
          style={{ paddingBottom: !src ? -1 : 0 }}
          as="img"
          src={src}
        >
          {/* <a href="https://unsplash.com/@bring_shrubbery"> */}

          {/* </a> */}
        </Squircle>
      )}
    </div>
  );
};
