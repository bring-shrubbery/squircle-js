<script setup lang="ts">
import { squircleDirective as vSquircle } from "@squircle-js/vue";

defineProps<{ onClick?: () => void }>();
</script>

<template>
  <button
    type="button"
    v-squircle="{ cornerRadius: 12, cornerSmoothing: 0.6 }"
    class="bg-indigo-600 px-5 py-2.5 text-white font-semibold text-sm"
    @click="onClick"
  >
    <slot />
  </button>
</template>
