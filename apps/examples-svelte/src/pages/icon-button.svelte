<script lang="ts">
  import IconButton from "../examples/IconButton.svelte";
</script>

<div class="flex gap-2">
  {#snippet plus()}
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="10" y1="4" x2="10" y2="16" />
      <line x1="4" y1="10" x2="16" y2="10" />
    </svg>
  {/snippet}

  {#snippet minus()}
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="4" y1="10" x2="16" y2="10" />
    </svg>
  {/snippet}

  {#snippet close()}
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="5" y1="5" x2="15" y2="15" />
      <line x1="15" y1="5" x2="5" y2="15" />
    </svg>
  {/snippet}

  <IconButton label="Add" onclick={() => {}}>{@render plus()}</IconButton>
  <IconButton label="Remove" onclick={() => {}}>{@render minus()}</IconButton>
  <IconButton label="Close" onclick={() => {}}>{@render close()}</IconButton>
</div>
