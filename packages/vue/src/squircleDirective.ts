import type { Directive } from "vue";
import { computeClipPath } from "./computePath.js";

export interface SquircleDirectiveOptions {
  cornerRadius?: number;
  cornerSmoothing?: number;
  width?: number;
  height?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

interface SquircleState {
  observer: ResizeObserver | null;
  opts: SquircleDirectiveOptions;
}

const state = new WeakMap<HTMLElement, SquircleState>();

function apply(
  node: HTMLElement,
  width: number,
  height: number,
  opts: SquircleDirectiveOptions
) {
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
}

function measure(node: HTMLElement, opts: SquircleDirectiveOptions) {
  const w = opts.width ?? node.offsetWidth ?? opts.defaultWidth ?? 0;
  const h = opts.height ?? node.offsetHeight ?? opts.defaultHeight ?? 0;
  const effectiveW = w > 0 ? w : (opts.defaultWidth ?? 0);
  const effectiveH = h > 0 ? h : (opts.defaultHeight ?? 0);
  apply(node, effectiveW, effectiveH, opts);
}

function reattach(node: HTMLElement, opts: SquircleDirectiveOptions) {
  const s = state.get(node);
  if (s?.observer) {
    s.observer.disconnect();
    s.observer = null;
  }
  const hasExplicit = opts.width !== undefined && opts.height !== undefined;
  if (hasExplicit) {
    apply(node, opts.width as number, opts.height as number, opts);
    return;
  }
  measure(node, opts);
  if (typeof ResizeObserver !== "undefined") {
    const entry: SquircleState = s ?? { observer: null, opts };
    entry.opts = opts;
    entry.observer = new ResizeObserver(() => measure(node, entry.opts));
    entry.observer.observe(node);
    state.set(node, entry);
  }
}

export const squircleDirective: Directive<
  HTMLElement,
  SquircleDirectiveOptions | undefined
> = {
  mounted(node, binding) {
    const opts = binding.value ?? {};
    state.set(node, { observer: null, opts });
    reattach(node, opts);
  },
  updated(node, binding) {
    reattach(node, binding.value ?? {});
  },
  beforeUnmount(node) {
    const s = state.get(node);
    s?.observer?.disconnect();
    state.delete(node);
  },
};
