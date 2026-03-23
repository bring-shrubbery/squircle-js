"use client";

import { Squircle } from "@squircle-js/react";
import { useState } from "react";

export const SquircleDemo = () => {
  const [cornerRadius, setCornerRadius] = useState(20);
  const [cornerSmoothing, setCornerSmoothing] = useState(1);

  return (
    <div className="my-8 rounded-lg border border-border p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <Squircle
          className="h-32 w-32 shrink-0 bg-foreground"
          cornerRadius={cornerRadius}
          cornerSmoothing={cornerSmoothing}
        />
        <div className="w-full space-y-4">
          <label className="block">
            <span className="mb-1 block font-medium text-sm">
              Corner Radius: {cornerRadius}px
            </span>
            <input
              className="w-full"
              max={50}
              min={0}
              onChange={(e) => setCornerRadius(Number(e.target.value))}
              type="range"
              value={cornerRadius}
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-medium text-sm">
              Corner Smoothing: {cornerSmoothing}
            </span>
            <input
              className="w-full"
              max={1}
              min={0}
              onChange={(e) => setCornerSmoothing(Number(e.target.value))}
              step={0.01}
              type="range"
              value={cornerSmoothing}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
