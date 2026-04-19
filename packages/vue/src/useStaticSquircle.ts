import {
  type MaybeRefOrGetter,
  onMounted,
  type Ref,
  toValue,
  watchEffect,
} from "vue";
import { computeClipPath } from "./computePath.js";

export interface UseStaticSquircleOptions {
  width: number;
  height: number;
  cornerRadius: number;
  cornerSmoothing: number;
}

export function useStaticSquircle(
  elRef: Ref<HTMLElement | null | undefined>,
  options: MaybeRefOrGetter<UseStaticSquircleOptions>
): void {
  const apply = (node: HTMLElement, opts: UseStaticSquircleOptions) => {
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
  };

  onMounted(() => {
    watchEffect(() => {
      const node = elRef.value;
      if (!node) {
        return;
      }
      apply(node, toValue(options));
    });
  });
}
