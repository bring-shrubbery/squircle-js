"use client";

import * as React from "react";
import { useMemo } from "react";
import { Slot } from "@radix-ui/react-slot";
import { getSvgPath } from "figma-squircle";

import { useElementSize } from "./use-element-size";

export { SquircleNoScript } from "./no-js";

interface SquircleProps {
  cornerSmoothing?: number;
  cornerRadius?: number;
  asChild?: boolean;
  children?: React.ReactNode;

  width?: number;
  height?: number;

  defaultWidth?: number;
  defaultHeight?: number;
}

function Squircle<E extends React.ElementType = "div">({
  cornerRadius,
  cornerSmoothing = 0.6,
  asChild,
  style,
  width: w,
  height: h,
  defaultWidth,
  defaultHeight,
  ...props
}: SquircleProps &
  Omit<React.ComponentPropsWithoutRef<E>, keyof SquircleProps>) {
  const Component = asChild ? Slot : "div";

  // Note: If you need to pass ref, wrap this component in another, and style to full-width/height.
  const [ref, { width, height }] = useElementSize<HTMLDivElement>({
    defaultWidth,
    defaultHeight,
  });

  const actualWidth = w ?? width;
  const actualHeight = h ?? height;

  const path = useMemo(() => {
    if (actualWidth === 0 || actualHeight === 0) return "";
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
        width: w ?? defaultWidth,
        height: h ?? defaultHeight,
        clipPath: `path('${path}')`,
      }}
      data-squircle={cornerRadius}
    />
  );
}

export { Squircle, type SquircleProps };
export * from "./StaticSquircle";
