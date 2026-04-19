<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { squircle } from "./squircle.svelte.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    cornerRadius?: number;
    cornerSmoothing?: number;
    width?: number;
    height?: number;
    defaultWidth?: number;
    defaultHeight?: number;
    children?: Snippet;
  }

  let {
    cornerRadius,
    cornerSmoothing = 0.6,
    width,
    height,
    defaultWidth,
    defaultHeight,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  {...rest}
  use:squircle={{
    cornerRadius,
    cornerSmoothing,
    width,
    height,
    defaultWidth,
    defaultHeight,
  }}
>
  {@render children?.()}
</div>
