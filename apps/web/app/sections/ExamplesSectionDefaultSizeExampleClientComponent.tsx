"use client";

import { Button } from "@/components/ui/button";
import { Squircle } from "@squircle-js/react";
import { RotateCcwIcon } from "lucide-react";
import Image from "next/image";
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
          cornerRadius={50}
          cornerSmoothing={1}
          defaultWidth={320}
          defaultHeight={214}
          className="bg-slate-100 w-fit h-fit"
          asChild
        >
          <Image src={src} width={320} height={214} alt="" />
        </Squircle>
      )}
    </div>
  );
};

// https://stackoverflow.com/questions/623172/how-to-get-the-image-size-height-width-using-javascript
