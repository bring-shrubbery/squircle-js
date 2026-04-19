<script setup>
import { ref } from "vue";
import { squircleDirective as vSquircle } from "@squircle-js/vue";

const visible = ref(true);
</script>

<template>
  <Transition name="fade">
    <div
      v-if="visible"
      v-squircle="{ cornerRadius: 20, cornerSmoothing: 0.6 }"
      class="bg-gradient-to-br from-violet-500 to-indigo-600 p-6 w-64 h-32"
    >
      Animated squircle card
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
