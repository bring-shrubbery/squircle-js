"use client";

import { Squircle } from "@squircle-js/react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export const SquircleDemoSection = () => {
  const [cornerRadius, setCornerRadius] = useState<number>(25);
  const [cornerSmoothing, setCornerSmoothing] = useState<number>(1);

  return (
    <div className="container mx-auto max-w-[960px] md:pt-24 mb-36">
      <h1 className="font-bold text-4xl leading-[180%] sm:text-5xl sm:leading-[150%] md:text-6xl text-center md:mx-auto mb-6 md:leading-[130%]">
        <span className="text-6xl sm:text-inherit leading-[200%]">
          Squircle
        </span>{" "}
        <Squircle
          asChild
          cornerRadius={cornerRadius}
          cornerSmoothing={cornerSmoothing}
          className="bg-black text-white pl-8 pr-8 pt-2 pb-2 text-6xl"
        >
          <span>Element</span>
        </Squircle>
        <br />
        for{" "}
        <span className="relative before:absolute before:-inset-x-1 before:h-1 before:-bottom-1 before:-rotate-2 before:bg-foreground before:-z-10">
          your
        </span>{" "}
        Frontend
      </h1>

      <div className="text-center text-lg mb-6">
        Use{" "}
        <Squircle
          asChild
          className="bg-foreground text-white py-1 pl-2 pr-2"
          cornerRadius={10}
          cornerSmoothing={1}
        >
          <span>{"<Squircle>"}</span>
        </Squircle>{" "}
        to build your own components.
        <br />
        If you{" "}
        <span className="font-bold">don&apos;t know what a squircle is</span>,
        read more below.
        <br />
        Available in <span className="font-bold">React</span>, and coming to
        other frontend frameworks soon!
      </div>

      <div className="space-y-12 mb-8 mx-auto max-w-[360px]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label
              htmlFor="corner-radius"
              className="mt-4"
            >{`Corner Radius (${cornerRadius}px)`}</Label>
            <Slider
              id="corner-radius"
              min={0}
              max={50}
              value={[cornerRadius]}
              onValueChange={(v) => setCornerRadius(v.at(0))}
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="corner-smoothing">
              {`Corner Smoothing (${cornerSmoothing}) `}
              {cornerSmoothing === 0
                ? "- Just like regular old button"
                : cornerSmoothing === 1
                ? "- Silky smooth!"
                : cornerSmoothing === 0.6
                ? "- like iOS icons"
                : ""}
            </Label>
            <Slider
              id="corner-smoothing"
              min={0}
              max={1}
              step={0.01}
              value={[cornerSmoothing]}
              onValueChange={(v) => setCornerSmoothing(v.at(0))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-bold text-2xl mx-auto w-fit">Try it out! 🙌</h2>
          <p className="text-center">
            {`Use sliders to control the "Element" component above. The difference is not huge, but makes a difference! 😉`}
          </p>
        </div>
      </div>
    </div>
  );
};
