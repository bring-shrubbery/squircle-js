<script lang="ts">
  import { staticSquircle } from "@squircle-js/svelte";

  type Tag = { id: string; label: string };

  let { tags } = $props<{ tags: Tag[] }>();
</script>

<div class="flex flex-wrap gap-2">
  {#each tags as tag (tag.id)}
    <div
      use:staticSquircle={{
        width: 80,
        height: 28,
        cornerRadius: 8,
        cornerSmoothing: 0.6,
      }}
      class="bg-sky-100 text-sky-800 text-xs font-medium flex items-center justify-center"
    >
      {tag.label}
    </div>
  {/each}
</div>
