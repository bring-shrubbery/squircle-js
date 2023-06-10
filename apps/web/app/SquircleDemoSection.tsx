"use client";

import { SquircleElement } from "@squircle-element/react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export const SquircleDemoSection = () => {
  const [cornerRadius, setCornerRadius] = useState<number>(25);
  const [cornerSmoothing, setCornerSmoothing] = useState<number>(1);

  return (
    <div className="container mx-auto max-w-[960px] md:pt-24 mb-36">
      <h1 className="font-bold text-4xl leading-[180%] sm:text-5xl sm:leading-[150%] md:text-6xl text-center md:mx-auto mb-6 md:leading-[130%]">
        Squircle{" "}
        <SquircleElement
          as="span"
          className="bg-black text-white pl-8 pr-8 pt-2 pb-2"
          cornerRadius={cornerRadius}
          cornerSmoothing={cornerSmoothing}
        >
          Element
        </SquircleElement>
        <br />
        for your Frontend
      </h1>

      <div className="text-center text-lg mb-10">
        Use{" "}
        <SquircleElement
          as="code"
          className="bg-gray-800 text-white py-1 pl-2 pr-2"
          cornerRadius={10}
          cornerSmoothing={1}
        >
          {"<SquircleElement>"}
        </SquircleElement>{" "}
        to build your own components.
        <br />
        Available in <span className="font-bold">React</span>, and coming to
        other frontend frameworks soon!
      </div>

      <div className="flex flex-col gap-4 w-full mb-8 mx-auto max-w-[360px]">
        <h2 className="font-bold text-2xl mx-auto">Try it out! 🙌</h2>
        <p className="text-center">
          {`Use sliders to control the "Element" component above. After, don't forget to star the repo 😉`}
        </p>

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
  );
};
