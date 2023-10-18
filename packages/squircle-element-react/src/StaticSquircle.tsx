import { Slot } from "@radix-ui/react-slot";
import { getSvgPath } from "figma-squircle";
import { ComponentPropsWithoutRef, PropsWithChildren, useMemo } from "react";

type StaticSquircleProps = {
  asChild?: boolean;

  width: number;
  height: number;
  cornerRadius: number;
  cornerSmoothing: number;
};

export const StaticSquircle = ({
  asChild,
  width,
  height,
  cornerRadius,
  cornerSmoothing,
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

  return <Component style={{ clipPath: `path('${path}')` }} {...props} />;
};
