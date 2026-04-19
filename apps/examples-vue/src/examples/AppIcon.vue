<script setup lang="ts">
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";

defineProps<{ src: string; name: string }>();
</script>

<template>
  <div class="flex flex-col items-center gap-1.5">
    <img
      :src="src"
      :alt="name"
      v-static-squircle="{
        width: 60,
        height: 60,
        cornerRadius: 13,
        cornerSmoothing: 0.6,
      }"
    />
    <span class="text-xs text-gray-700">{{ name }}</span>
  </div>
</template>
