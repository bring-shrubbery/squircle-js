import { createElementSize } from "@solid-primitives/resize-observer";
import { getSvgPath } from "figma-squircle";
import {
  createMemo,
  createSignal,
  type JSX,
  mergeProps,
  splitProps,
} from "solid-js";
import { Dynamic } from "solid-js/web";

import { renderAsChild } from "./polymorphic";

export interface SquircleProps {
  cornerRadius?: number;
  cornerSmoothing?: number;
  asChild?: boolean;
  children?: JSX.Element;

  width?: number;
  height?: number;

  defaultWidth?: number;
  defaultHeight?: number;

  style?: JSX.CSSProperties | string;
}

export function Squircle(
  rawProps: SquircleProps &
    Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof SquircleProps>
) {
  const props = mergeProps({ cornerSmoothing: 0.6 }, rawProps);

  const [local, others] = splitProps(props, [
    "cornerRadius",
    "cornerSmoothing",
    "asChild",
    "children",
    "width",
    "height",
    "defaultWidth",
    "defaultHeight",
    "style",
  ]);

  const [ref, setRef] = createSignal<HTMLElement | null>(null);
  const observedSize = createElementSize(ref);

  const measuredWidth = () => {
    const w = observedSize.width;
    return w && w > 0 ? w : (local.defaultWidth ?? 0);
  };
  const measuredHeight = () => {
    const h = observedSize.height;
    return h && h > 0 ? h : (local.defaultHeight ?? 0);
  };

  const actualWidth = () => local.width ?? measuredWidth();
  const actualHeight = () => local.height ?? measuredHeight();

  const path = createMemo(() => {
    const w = actualWidth();
    const h = actualHeight();
    if (w === 0 || h === 0) {
      return "";
    }
    return getSvgPath({
      width: w,
      height: h,
      cornerRadius: local.cornerRadius,
      cornerSmoothing: local.cornerSmoothing,
    });
  });

  const toPx = (value: number | undefined) =>
    value === undefined ? undefined : `${value}px`;

  const mergedStyle = createMemo<JSX.CSSProperties>(() => {
    const extraStyle =
      typeof local.style === "object" && local.style !== null
        ? local.style
        : {};
    const p = path();
    return {
      ...extraStyle,
      "border-radius": toPx(local.cornerRadius),
      width: toPx(local.width ?? local.defaultWidth),
      height: toPx(local.height ?? local.defaultHeight),
      "clip-path": p ? `path('${p}')` : undefined,
    };
  });

  const elementProps = mergeProps(others, {
    ref: setRef,
    get "data-squircle"() {
      return local.cornerRadius;
    },
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
