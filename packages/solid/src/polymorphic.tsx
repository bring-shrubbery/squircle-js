import { children, type JSX } from "solid-js";
import { spread } from "solid-js/web";

export type PolymorphicProps = Record<string, unknown>;

/**
 * Resolves `getChildren` and, if it yields exactly one DOM element,
 * applies `props` to that element via `spread` and returns it.
 * Returns `null` if the resolved value is not a single Element —
 * callers should fall back to rendering a wrapping element themselves.
 */
export function renderAsChild(
  getChildren: () => JSX.Element,
  props: PolymorphicProps
): Element | null {
  const resolved = children(getChildren);
  const node = resolved();

  if (Array.isArray(node)) {
    return null;
  }
  if (node instanceof Element) {
    spread(node, props, false, true);
    return node;
  }
  return null;
}
