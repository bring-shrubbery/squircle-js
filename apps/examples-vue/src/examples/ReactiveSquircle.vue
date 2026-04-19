<script setup>
import { ref } from "vue";
import { Squircle } from "@squircle-js/vue";

const radius = ref(16);
</script>

<template>
  <div class="flex items-center gap-4">
    <input type="range" min="0" max="64" v-model.number="radius" />
    <Squircle :corner-radius="radius" class="w-32 h-32 bg-emerald-500" />
  </div>
</template>
