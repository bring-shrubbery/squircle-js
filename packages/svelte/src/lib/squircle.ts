import type { Action } from "svelte/action";

import { computeClipPath } from "./computePath.js";

export interface SquircleActionOptions {
  cornerRadius?: number;
  cornerSmoothing?: number;
  width?: number;
  height?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

export const squircle: Action<
  HTMLElement,
  SquircleActionOptions | undefined
> = (node, initialOptions) => {
  let opts: SquircleActionOptions = initialOptions ?? {};
  let observer: ResizeObserver | null = null;

  const apply = (width: number, height: number) => {
    const path = computeClipPath({
      width,
      height,
      cornerRadius: opts.cornerRadius,
      cornerSmoothing: opts.cornerSmoothing,
    });
    node.style.clipPath = path ? `path('${path}')` : "";

    if (opts.cornerRadius === undefined) {
      node.removeAttribute("data-squircle");
    } else {
      node.style.borderRadius = `${opts.cornerRadius}px`;
      node.setAttribute("data-squircle", String(opts.cornerRadius));
    }

    if (opts.width !== undefined) {
      node.style.width = `${opts.width}px`;
    }
    if (opts.height !== undefined) {
      node.style.height = `${opts.height}px`;
    }
  };

  const measure = () => {
    const w = opts.width ?? node.offsetWidth ?? opts.defaultWidth ?? 0;
    const h = opts.height ?? node.offsetHeight ?? opts.defaultHeight ?? 0;
    const effectiveW = w > 0 ? w : (opts.defaultWidth ?? 0);
    const effectiveH = h > 0 ? h : (opts.defaultHeight ?? 0);
    apply(effectiveW, effectiveH);
  };

  const hasExplicitSize = () =>
    opts.width !== undefined && opts.height !== undefined;

  if (hasExplicitSize()) {
    apply(opts.width as number, opts.height as number);
  } else {
    measure();
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(node);
    }
  }

  return {
    update(newOptions: SquircleActionOptions | undefined) {
      opts = newOptions ?? {};

      if (hasExplicitSize()) {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        apply(opts.width as number, opts.height as number);
        return;
      }

      if (!observer && typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(measure);
        observer.observe(node);
      }

      measure();
    },
    destroy() {
      observer?.disconnect();
      observer = null;
    },
  };
};
