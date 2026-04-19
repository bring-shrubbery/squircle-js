<script setup lang="ts">
import { Squircle } from "@squircle-js/vue";

defineProps<{ count: number }>();
</script>

<template>
  <Squircle
    :corner-radius="6"
    :corner-smoothing="0.6"
    class="bg-red-500 px-1.5 py-0.5 text-white text-xs font-bold min-w-[20px] text-center"
  >
    {{ count }}
  </Squircle>
</template>
