<script lang="ts">
  import { squircle } from "@squircle-js/svelte";

  let { onclick, children } = $props<{
    onclick?: () => void;
    children: import("svelte").Snippet;
  }>();
</script>

<button
  type="button"
  {onclick}
  use:squircle={{ cornerRadius: 12, cornerSmoothing: 0.6 }}
  class="bg-indigo-600 px-5 py-2.5 text-white font-semibold text-sm"
>
  {@render children()}
</button>
