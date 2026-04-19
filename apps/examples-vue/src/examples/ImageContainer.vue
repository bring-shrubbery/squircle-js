<script setup lang="ts">
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";

defineProps<{ src: string; alt: string }>();
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    v-static-squircle="{
      width: 600,
      height: 400,
      cornerRadius: 32,
      cornerSmoothing: 0.8,
    }"
    class="object-cover"
  />
</template>
