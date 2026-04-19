import { StaticSquircle } from "@squircle-js/solid";
import { For } from "solid-js";

type Tag = { id: string; label: string };

export function TagList(props: { tags: Tag[] }) {
  return (
    <div class="flex flex-wrap gap-2">
      <For each={props.tags}>
        {(tag) => (
          <StaticSquircle
            class="flex items-center justify-center bg-sky-100 font-medium text-sky-800 text-xs"
            cornerRadius={8}
            cornerSmoothing={0.6}
            height={28}
            width={80}
          >
            {tag.label}
          </StaticSquircle>
        )}
      </For>
    </div>
  );
}
