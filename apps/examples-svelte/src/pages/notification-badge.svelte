<script lang="ts">
  import NotificationBadge from "../examples/NotificationBadge.svelte";
</script>

<div class="flex items-center gap-3">
  <NotificationBadge count={1} />
  <NotificationBadge count={8} />
  <NotificationBadge count={42} />
</div>
