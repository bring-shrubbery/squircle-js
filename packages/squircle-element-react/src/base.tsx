"use client";

import { useRender } from "@base-ui/react/use-render";
import { forwardRef } from "react";

import { type SquircleOptions, useSquircle } from "./use-squircle";

type SquircleProps = SquircleOptions &
  Omit<useRender.ComponentProps<"div">, keyof SquircleOptions>;

const Squircle = forwardRef<HTMLDivElement, SquircleProps>(function Squircle(
  {
    cornerRadius,
    cornerSmoothing = 0.6,
    render,
    style,
    width,
    height,
    defaultWidth,
    defaultHeight,
    ...props
  },
  forwardedRef
) {
  const { ref, elementProps } = useSquircle({
    cornerRadius,
    cornerSmoothing,
    style,
    width,
    height,
    defaultWidth,
    defaultHeight,
  });

  return useRender({
    defaultTagName: "div",
    render,
    ref: [forwardedRef, ref],
    props: { ...props, ...elementProps },
  });
});

export { Squircle, type SquircleProps };
