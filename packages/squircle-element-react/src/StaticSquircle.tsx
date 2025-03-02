import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import * as React from "react";
import { useMemo } from "react";
import { Slot } from "@radix-ui/react-slot";
import { getSvgPath } from "figma-squircle";

interface StaticSquircleProps {
  asChild?: boolean;

  width: number;
  height: number;
  cornerRadius: number;
  cornerSmoothing: number;
  topLeftCornerRadius?: number;
  topRightCornerRadius?: number;
  bottomRightCornerRadius?: number;
  bottomLeftCornerRadius?: number;
}

export const StaticSquircle = ({
  asChild,
  width,
  height,
  cornerRadius,
  cornerSmoothing,
  topLeftCornerRadius,
  topRightCornerRadius,
  bottomRightCornerRadius,
  bottomLeftCornerRadius,
  style,
  ...props
}: PropsWithChildren<
  StaticSquircleProps & ComponentPropsWithoutRef<"div">
>) => {
  const Component = asChild ? Slot : "div";

  const path = useMemo(() => {
    return getSvgPath({
      width,
      height,
      cornerRadius,
      cornerSmoothing,
      topLeftCornerRadius,
      topRightCornerRadius,
      bottomRightCornerRadius,
      bottomLeftCornerRadius,
    });
  }, [
      width,
      height,
      cornerRadius,
      cornerSmoothing,
      topLeftCornerRadius,
      topRightCornerRadius,
      bottomRightCornerRadius,
      bottomLeftCornerRadius,
  ]);

  return (
    <Component style={{ clipPath: `path('${path}')`, ...style }} {...props} />
  );
};
