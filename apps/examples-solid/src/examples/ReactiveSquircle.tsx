import { Squircle } from "@squircle-js/solid";
import { createSignal } from "solid-js";

export function Adjustable() {
  const [radius, setRadius] = createSignal(16);

  return (
    <div class="flex items-center gap-4">
      <input
        max="64"
        min="0"
        onInput={(e) => setRadius(Number(e.currentTarget.value))}
        type="range"
        value={radius()}
      />
      <Squircle class="h-32 w-32 bg-emerald-500" cornerRadius={radius()} />
    </div>
  );
}
