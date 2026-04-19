import type { Component } from "solid-js";
import { StaticSquircle } from "@squircle-js/solid";

export function IconButton(props: {
  icon: Component<{ class?: string }>;
  label: string;
  onClick?: () => void;
}) {
  const Icon = props.icon;
  return (
    <StaticSquircle
      width={40}
      height={40}
      cornerRadius={10}
      cornerSmoothing={0.6}
      class="bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
      asChild
    >
      <button type="button" aria-label={props.label} onClick={props.onClick}>
        <Icon class="w-5 h-5 text-gray-700" />
      </button>
    </StaticSquircle>
  );
}
