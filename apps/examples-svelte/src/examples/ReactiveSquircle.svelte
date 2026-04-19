<script>
  import { Squircle } from "@squircle-js/svelte";

  let radius = $state(16);
</script>

<div class="flex items-center gap-4">
  <input type="range" min="0" max="64" bind:value={radius} />
  <Squircle cornerRadius={radius} class="w-32 h-32 bg-emerald-500" />
</div>
