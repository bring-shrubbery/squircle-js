"use client";

import { Squircle } from "@squircle-js/react";
import { RotateCcwIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const ExamplesSectionDefaultSizeExampleClientComponent = () => {
  const [src, setSrc] = useState("");

  const handleRefetchImage = useCallback(() => {
    setSrc("");

    const timeout = setTimeout(() => {
      setSrc("/antoni-silvestrovic-baS2vUSSGBY-unsplash.jpg");
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    handleRefetchImage();
  }, [handleRefetchImage]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button onClick={handleRefetchImage} variant="outline">
        <RotateCcwIcon className={"mr-2 h-4 w-4"} />
        Refetch Image
      </Button>
      {src && (
        <Squircle
          asChild
          className="h-fit w-fit bg-slate-100"
          cornerRadius={50}
          cornerSmoothing={1}
          defaultHeight={214}
          defaultWidth={320}
        >
          <Image alt="" height={214} src={src} width={320} />
        </Squircle>
      )}
    </div>
  );
};

// https://stackoverflow.com/questions/623172/how-to-get-the-image-size-height-width-using-javascript
