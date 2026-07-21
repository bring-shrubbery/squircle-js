"use client";

import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";

import { type SquircleOptions, useSquircle } from "./use-squircle";

export { SquircleNoScript } from "./no-js";

interface SquircleProps extends SquircleOptions {
  asChild?: boolean;
  children?: React.ReactNode;
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
  const { ref, elementProps } = useSquircle({
    cornerRadius,
    cornerSmoothing,
    style,
    width: w,
    height: h,
    defaultWidth,
    defaultHeight,
  });

  return <Component {...props} {...elementProps} ref={ref} />;
}

export * from "./StaticSquircle";
export { Squircle, type SquircleProps };
