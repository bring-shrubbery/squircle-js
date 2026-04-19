import { createSignal } from "solid-js";
import { Squircle } from "@squircle-js/solid";

export function Adjustable() {
  const [radius, setRadius] = createSignal(16);

  return (
    <div class="flex items-center gap-4">
      <input
        type="range"
        min="0"
        max="64"
        value={radius()}
        onInput={(e) => setRadius(Number(e.currentTarget.value))}
      />
      <Squircle
        cornerRadius={radius()}
        class="w-32 h-32 bg-emerald-500"
      />
    </div>
  );
}
