import type { Action } from "svelte/action";

import { computeClipPath } from "./computePath.js";

export interface StaticSquircleActionOptions {
  width: number;
  height: number;
  cornerRadius: number;
  cornerSmoothing: number;
}

export const staticSquircle: Action<
  HTMLElement,
  StaticSquircleActionOptions
> = (node, initialOptions) => {
  const apply = (opts: StaticSquircleActionOptions) => {
    const path = computeClipPath(opts);
    node.style.clipPath = path ? `path('${path}')` : "";
    node.style.borderRadius = `${opts.cornerRadius}px`;
    node.setAttribute("data-squircle", String(opts.cornerRadius));
    node.style.width = `${opts.width}px`;
    node.style.height = `${opts.height}px`;
  };

  apply(initialOptions);

  return {
    update(newOptions: StaticSquircleActionOptions) {
      apply(newOptions);
    },
  };
};
