import { getSvgPath } from "figma-squircle";

export interface ComputeClipPathOptions {
  width: number;
  height: number;
  cornerRadius?: number;
  cornerSmoothing?: number;
}

export function computeClipPath(opts: ComputeClipPathOptions): string {
  if (opts.width === 0 || opts.height === 0) return "";
  return getSvgPath({
    width: opts.width,
    height: opts.height,
    cornerRadius: opts.cornerRadius,
    cornerSmoothing: opts.cornerSmoothing ?? 0.6,
  });
}
