<script lang="ts">
  import { staticSquircle } from "@squircle-js/svelte";

  let { label, onclick, children } = $props<{
    label: string;
    onclick?: () => void;
    children: import("svelte").Snippet;
  }>();
</script>

<button
  type="button"
  aria-label={label}
  {onclick}
  use:staticSquircle={{
    width: 40,
    height: 40,
    cornerRadius: 10,
    cornerSmoothing: 0.6,
  }}
  class="bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
>
  {@render children()}
</button>
