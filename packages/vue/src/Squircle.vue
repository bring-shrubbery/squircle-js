<script setup lang="ts">
import { ref } from "vue";
import { useSquircle, type UseSquircleOptions } from "./useSquircle";

defineOptions({ inheritAttrs: true });

const props = withDefaults(defineProps<UseSquircleOptions>(), {
  cornerSmoothing: 0.6,
});

const el = ref<HTMLDivElement | null>(null);

useSquircle(el, () => ({
  cornerRadius: props.cornerRadius,
  cornerSmoothing: props.cornerSmoothing,
  width: props.width,
  height: props.height,
  defaultWidth: props.defaultWidth,
  defaultHeight: props.defaultHeight,
}));
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>
