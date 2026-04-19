<script lang="ts">
  import ListOfSquircles from "../examples/ListOfSquircles.svelte";

  const tags = [
    { id: "1", label: "svelte" },
    { id: "2", label: "runes" },
    { id: "3", label: "squircle" },
    { id: "4", label: "design" },
    { id: "5", label: "ios" },
    { id: "6", label: "ui" },
  ];
</script>

<ListOfSquircles {tags} />
