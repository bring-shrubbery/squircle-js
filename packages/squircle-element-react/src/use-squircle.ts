import { getSvgPath } from "figma-squircle";
import type { CSSProperties } from "react";
import { useMemo } from "react";

import { useElementSize } from "./use-element-size";

export interface SquircleOptions {
  cornerSmoothing?: number;
  cornerRadius?: number;

  width?: number;
  height?: number;

  defaultWidth?: number;
  defaultHeight?: number;
}

export function useSquircle({
  cornerRadius,
  cornerSmoothing = 0.6,
  style,
  width: requestedWidth,
  height: requestedHeight,
  defaultWidth,
  defaultHeight,
}: SquircleOptions & { style?: CSSProperties }) {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>({
    defaultWidth,
    defaultHeight,
  });

  const actualWidth = requestedWidth ?? width;
  const actualHeight = requestedHeight ?? height;

  const path = useMemo(() => {
    if (actualWidth === 0 || actualHeight === 0) {
      return "";
    }
    return getSvgPath({
      width: actualWidth,
      height: actualHeight,
      cornerRadius,
      cornerSmoothing,
    });
  }, [actualWidth, actualHeight, cornerRadius, cornerSmoothing]);

  return {
    ref,
    elementProps: {
      "data-squircle": cornerRadius,
      style: {
        ...style,
        borderRadius: cornerRadius,
        width: requestedWidth ?? defaultWidth,
        height: requestedHeight ?? defaultHeight,
        clipPath: `path('${path}')`,
      },
    },
  };
}
