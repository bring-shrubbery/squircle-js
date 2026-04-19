import { For } from "solid-js";
import { StaticSquircle } from "@squircle-js/solid";

type Tag = { id: string; label: string };

export function TagList(props: { tags: Tag[] }) {
  return (
    <div class="flex flex-wrap gap-2">
      <For each={props.tags}>
        {(tag) => (
          <StaticSquircle
            width={80}
            height={28}
            cornerRadius={8}
            cornerSmoothing={0.6}
            class="bg-sky-100 text-sky-800 text-xs font-medium flex items-center justify-center"
          >
            {tag.label}
          </StaticSquircle>
        )}
      </For>
    </div>
  );
}
