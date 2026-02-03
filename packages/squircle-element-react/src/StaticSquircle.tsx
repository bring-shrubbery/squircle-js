import { Slot } from "@radix-ui/react-slot";
import { getSvgPath } from "figma-squircle";
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { useMemo } from "react";

interface StaticSquircleProps {
  asChild?: boolean;

  width: number;
  height: number;
  cornerRadius: number;
  cornerSmoothing: number;
}

export const StaticSquircle = ({
  asChild,
  width,
  height,
  cornerRadius,
  cornerSmoothing,
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
    });
  }, [width, height, cornerRadius, cornerSmoothing]);

  return (
    <Component style={{ clipPath: `path('${path}')`, ...style }} {...props} />
  );
};
