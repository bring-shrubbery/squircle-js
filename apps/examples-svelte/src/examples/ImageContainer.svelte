<script lang="ts">
  import { staticSquircle } from "@squircle-js/svelte";

  let { src, alt } = $props<{ src: string; alt: string }>();
</script>

<img
  {src}
  {alt}
  use:staticSquircle={{
    width: 600,
    height: 400,
    cornerRadius: 32,
    cornerSmoothing: 0.8,
  }}
  class="object-cover"
/>
