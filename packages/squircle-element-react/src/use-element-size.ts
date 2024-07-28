// From usehooks-ts
import { useCallback, useState } from "react";

import { useEventListener } from "./use-event-listener";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

interface Size {
  width: number;
  height: number;
}

export function useElementSize<
  T extends HTMLElement = HTMLDivElement,
>(defaultSize: {
  defaultWidth?: number;
  defaultHeight?: number;
}): [(node: T | null) => void, Size] {
  // Mutable values like 'ref.current' aren't valid dependencies
  // because mutating them doesn't re-render the component.
  // Instead, we use a state as a ref to be reactive.
  const [ref, setRef] = useState<T | null>(null);
  const [size, setSize] = useState<Size>({
    width: defaultSize.defaultWidth ?? 0,
    height: defaultSize.defaultHeight ?? 0,
  });

  // Prevent too many rendering using useCallback
  const handleSize = useCallback(() => {
    setSize({
      width: ref?.offsetWidth ?? 0,
      height: ref?.offsetHeight ?? 0,
    });
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  useEventListener("resize", handleSize);

  useIsomorphicLayoutEffect(() => {
    handleSize();
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  return [setRef, size];
}
