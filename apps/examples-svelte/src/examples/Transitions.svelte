<script>
  import { squircle } from "@squircle-js/svelte";
  import { fade } from "svelte/transition";
</script>

<div
  use:squircle={{ cornerRadius: 20, cornerSmoothing: 0.6 }}
  transition:fade={{ duration: 200 }}
  class="bg-gradient-to-br from-violet-500 to-indigo-600 p-6 w-64 h-32"
>
  Animated squircle card
</div>
