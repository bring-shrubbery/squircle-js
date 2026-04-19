<script lang="ts">
  import { staticSquircle } from "@squircle-js/svelte";

  let { src, alt, size = 48 } = $props<{
    src: string;
    alt: string;
    size?: number;
  }>();
</script>

<img
  {src}
  {alt}
  use:staticSquircle={{
    width: size,
    height: size,
    cornerRadius: Math.round(size * 0.25),
    cornerSmoothing: 0.6,
  }}
  class="object-cover shrink-0"
/>
