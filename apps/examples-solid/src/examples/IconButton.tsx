import { StaticSquircle } from "@squircle-js/solid";
import type { Component } from "solid-js";

export function IconButton(props: {
  icon: Component<{ class?: string }>;
  label: string;
  onClick?: () => void;
}) {
  const Icon = props.icon;
  return (
    <StaticSquircle
      asChild
      class="flex items-center justify-center bg-gray-100 transition-colors hover:bg-gray-200"
      cornerRadius={10}
      cornerSmoothing={0.6}
      height={40}
      width={40}
    >
      <button aria-label={props.label} onClick={props.onClick} type="button">
        <Icon class="h-5 w-5 text-gray-700" />
      </button>
    </StaticSquircle>
  );
}
