<script lang="ts">
  import { Squircle } from "@squircle-js/svelte";

  let { title, body } = $props<{ title: string; body: string }>();
</script>

<Squircle
  cornerRadius={20}
  cornerSmoothing={0.6}
  class="bg-white shadow-md p-6 space-y-2"
>
  <h3 class="font-semibold text-lg">{title}</h3>
  <p class="text-gray-600 text-sm">{body}</p>
</Squircle>
