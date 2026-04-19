<script lang="ts">
  import AppIcon from "../examples/AppIcon.svelte";

  const icons = [
    { src: "https://picsum.photos/seed/svelte-notes/120/120", name: "Notes" },
    { src: "https://picsum.photos/seed/svelte-mail/120/120", name: "Mail" },
    { src: "https://picsum.photos/seed/svelte-maps/120/120", name: "Maps" },
    { src: "https://picsum.photos/seed/svelte-music/120/120", name: "Music" },
  ];
</script>

<div class="flex gap-4">
  {#each icons as icon (icon.name)}
    <AppIcon src={icon.src} name={icon.name} />
  {/each}
</div>
