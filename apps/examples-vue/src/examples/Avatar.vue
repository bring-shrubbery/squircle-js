<script setup lang="ts">
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";

const props = withDefaults(
  defineProps<{ src: string; alt: string; size?: number }>(),
  { size: 48 },
);
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    v-static-squircle="{
      width: props.size,
      height: props.size,
      cornerRadius: Math.round(props.size * 0.25),
      cornerSmoothing: 0.6,
    }"
    class="object-cover shrink-0"
  />
</template>
