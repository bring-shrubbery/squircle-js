import {
  type MaybeRefOrGetter,
  onBeforeUnmount,
  onMounted,
  type Ref,
  toValue,
  watchEffect,
} from "vue";
import { computeClipPath } from "./computePath.js";

export interface UseSquircleOptions {
  cornerRadius?: number;
  cornerSmoothing?: number;
  width?: number;
  height?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

export function useSquircle(
  elRef: Ref<HTMLElement | null | undefined>,
  options: MaybeRefOrGetter<UseSquircleOptions> = {},
): void {
  let observer: ResizeObserver | null = null;

  const apply = (
    node: HTMLElement,
    width: number,
    height: number,
    opts: UseSquircleOptions,
  ) => {
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

  const measure = (node: HTMLElement, opts: UseSquircleOptions) => {
    const w = opts.width ?? node.offsetWidth ?? opts.defaultWidth ?? 0;
    const h = opts.height ?? node.offsetHeight ?? opts.defaultHeight ?? 0;
    const effectiveW = w > 0 ? w : (opts.defaultWidth ?? 0);
    const effectiveH = h > 0 ? h : (opts.defaultHeight ?? 0);
    apply(node, effectiveW, effectiveH, opts);
  };

  onMounted(() => {
    watchEffect(() => {
      const node = elRef.value;
      if (!node) {
        return;
      }
      const opts = toValue(options);
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (opts.width !== undefined && opts.height !== undefined) {
        apply(node, opts.width, opts.height, opts);
        return;
      }
      measure(node, opts);
      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(() => measure(node, toValue(options)));
        observer.observe(node);
      }
    });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });
}
