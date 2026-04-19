<script setup lang="ts">
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";

defineProps<{ tags: Array<{ id: string; label: string }> }>();
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="tag in tags"
      :key="tag.id"
      v-static-squircle="{
        width: 80,
        height: 28,
        cornerRadius: 8,
        cornerSmoothing: 0.6,
      }"
      class="bg-sky-100 text-sky-800 text-xs font-medium flex items-center justify-center"
    >
      {{ tag.label }}
    </div>
  </div>
</template>
