// From usehooks-ts
import { useEffect, useState } from "react";

import { useEventListener } from "./use-event-listener";

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

  // Use ResizeObserver for dynamic size changes
  useEffect(() => {
    if (!ref) {
      return;
    }
    const handleResize = () => {
      setSize({
        width: ref.offsetWidth ?? 0,
        height: ref.offsetHeight ?? 0,
      });
    };
    handleResize(); // Initial size
    const resizeObserver = new (window as any).ResizeObserver(handleResize);
    resizeObserver.observe(ref);
    return () => resizeObserver.disconnect();
  }, [ref]);

  // Fallback: still listen to window resize for edge cases
  useEventListener("resize", () => {
    if (!ref) {
      return;
    }
    setSize({
      width: ref.offsetWidth ?? 0,
      height: ref.offsetHeight ?? 0,
    });
  });

  return [setRef, size];
}
