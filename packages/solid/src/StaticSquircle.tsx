import { getSvgPath } from "figma-squircle";
import { createMemo, type JSX, mergeProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { renderAsChild } from "./polymorphic";

export interface StaticSquircleProps {
  width: number;
  height: number;
  cornerRadius: number;
  cornerSmoothing: number;
  asChild?: boolean;
  children?: JSX.Element;
  style?: JSX.CSSProperties | string;
}

export function StaticSquircle(
  rawProps: StaticSquircleProps &
    Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof StaticSquircleProps>
) {
  const [local, others] = splitProps(rawProps, [
    "asChild",
    "width",
    "height",
    "cornerRadius",
    "cornerSmoothing",
    "children",
    "style",
  ]);

  const path = createMemo(() =>
    getSvgPath({
      width: local.width,
      height: local.height,
      cornerRadius: local.cornerRadius,
      cornerSmoothing: local.cornerSmoothing,
    })
  );

  const mergedStyle = createMemo<JSX.CSSProperties>(() => {
    const extraStyle =
      typeof local.style === "object" && local.style !== null
        ? local.style
        : {};
    return {
      ...extraStyle,
      "clip-path": `path('${path()}')`,
    };
  });

  const elementProps = mergeProps(others, {
    get style() {
      return mergedStyle();
    },
    get children() {
      return local.children;
    },
  });

  if (local.asChild) {
    const rendered = renderAsChild(() => local.children, elementProps);
    if (rendered) {
      return rendered;
    }
  }

  return <Dynamic component="div" {...elementProps} />;
}
