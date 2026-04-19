<script lang="ts">
  import { staticSquircle } from "@squircle-js/svelte";

  let { src, name } = $props<{ src: string; name: string }>();
</script>

<div class="flex flex-col items-center gap-1.5">
  <img
    {src}
    alt={name}
    use:staticSquircle={{
      width: 60,
      height: 60,
      cornerRadius: 13,
      cornerSmoothing: 0.6,
    }}
  />
  <span class="text-xs text-gray-700">{name}</span>
</div>
