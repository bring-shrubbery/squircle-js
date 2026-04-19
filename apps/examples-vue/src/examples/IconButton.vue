<script setup lang="ts">
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";

defineProps<{ label: string; onClick?: () => void }>();
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    v-static-squircle="{
      width: 40,
      height: 40,
      cornerRadius: 10,
      cornerSmoothing: 0.6,
    }"
    class="bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
    @click="onClick"
  >
    <slot />
  </button>
</template>
