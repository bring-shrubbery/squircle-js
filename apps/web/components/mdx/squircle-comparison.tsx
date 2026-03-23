"use client";

import { Squircle } from "@squircle-js/react";
import { useState } from "react";

export const SquircleComparison = () => {
  const [cornerRadius, setCornerRadius] = useState(20);

  return (
    <div className="my-8 rounded-lg border border-border p-6">
      <div className="mb-4 flex justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <div
            className="h-32 w-32 bg-foreground"
            style={{ borderRadius: cornerRadius }}
          />
          <span className="text-muted-foreground text-sm">border-radius</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Squircle
            className="h-32 w-32 bg-foreground"
            cornerRadius={cornerRadius}
            cornerSmoothing={1}
          />
          <span className="text-muted-foreground text-sm">squircle</span>
        </div>
      </div>
      <label className="block">
        <span className="mb-1 block text-center font-medium text-sm">
          Corner Radius: {cornerRadius}px
        </span>
        <input
          className="w-full"
          max={64}
          min={0}
          onChange={(e) => setCornerRadius(Number(e.target.value))}
          type="range"
          value={cornerRadius}
        />
      </label>
    </div>
  );
};
