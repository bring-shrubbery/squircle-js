"use client";

import { getSvgPath } from "figma-squircle";
import { useMemo } from "react";

import { useElementSize } from "./use-element-size";
export { SquircleNoScript } from "./no-js";

interface SquircleProps<E extends React.ElementType> {
  cornerSmoothing?: number;
  cornerRadius?: number;
  as?: E;
  children?: React.ReactNode;

  width?: number;
  height?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

function Squircle<E extends React.ElementType = "div">({
  cornerRadius,
  cornerSmoothing = 0.6,
  as,
  style,
  width: w,
  height: h,
  defaultWidth,
  defaultHeight,
  ...props
}: SquircleProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof SquircleProps<E>>) {
  const Component = as || "div";

  // Note: If you need to pass ref, wrap this component in another, and style to full-width/height.
  const [ref, { width, height }] = useElementSize<HTMLDivElement>({
    width: defaultWidth,
    height: defaultHeight,
  });

  const actualWidth = w ?? width;
  const actualHeight = h ?? height;

  const path = useMemo(() => {
    return getSvgPath({
      width: actualWidth,
      height: actualHeight,
      cornerRadius,
      cornerSmoothing,
    });
  }, [actualWidth, actualHeight, cornerRadius, cornerSmoothing]);

  return (
    <Component
      {...props}
      ref={ref}
      style={{
        ...style,
        borderRadius: cornerRadius,
        // width: actualWidth,
        // height: actualHeight,
        clipPath: `path('${path}')`,
      }}
      data-squircle={cornerRadius}
    />
  );
}

export { Squircle, type SquircleProps };
