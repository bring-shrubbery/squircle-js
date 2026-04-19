<script setup lang="ts">
import { ref } from "vue";
import {
  useStaticSquircle,
  type UseStaticSquircleOptions,
} from "./useStaticSquircle";

defineOptions({ inheritAttrs: true });

const props = withDefaults(defineProps<UseStaticSquircleOptions>(), {
  cornerSmoothing: 0.6,
});

const el = ref<HTMLDivElement | null>(null);

useStaticSquircle(el, () => ({
  width: props.width,
  height: props.height,
  cornerRadius: props.cornerRadius,
  cornerSmoothing: props.cornerSmoothing,
}));
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>
