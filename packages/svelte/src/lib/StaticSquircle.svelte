<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { staticSquircle } from "./staticSquircle.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    width: number;
    height: number;
    cornerRadius: number;
    cornerSmoothing: number;
    children?: Snippet;
  }

  let {
    width,
    height,
    cornerRadius,
    cornerSmoothing,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  {...rest}
  use:staticSquircle={{ width, height, cornerRadius, cornerSmoothing }}
>
  {@render children?.()}
</div>
