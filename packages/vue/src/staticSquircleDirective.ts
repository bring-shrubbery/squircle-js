import type { Directive } from "vue";
import { computeClipPath } from "./computePath.js";

export interface StaticSquircleDirectiveOptions {
  width: number;
  height: number;
  cornerRadius: number;
  cornerSmoothing: number;
}

function apply(node: HTMLElement, opts: StaticSquircleDirectiveOptions) {
  const path = computeClipPath({
    width: opts.width,
    height: opts.height,
    cornerRadius: opts.cornerRadius,
    cornerSmoothing: opts.cornerSmoothing,
  });
  node.style.clipPath = path ? `path('${path}')` : "";
  node.style.borderRadius = `${opts.cornerRadius}px`;
  node.setAttribute("data-squircle", String(opts.cornerRadius));
  node.style.width = `${opts.width}px`;
  node.style.height = `${opts.height}px`;
}

export const staticSquircleDirective: Directive<
  HTMLElement,
  StaticSquircleDirectiveOptions
> = {
  mounted(node, binding) {
    apply(node, binding.value);
  },
  updated(node, binding) {
    apply(node, binding.value);
  },
};
