<script lang="ts">
export interface StaticSquircleProps {
    /**
     * The element or component this component should render as when not a div.
     * @defaultValue 'div'
     */
    as?: any;
    cornerSmoothing?: number;
    cornerRadius?: number;
    width?: number;
    height?: number;
}

export interface StaticSquircleSlots {
    default(props?: {}): any;
}
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { getSvgPath } from 'figma-squircle';
import { useElementSize } from '@vueuse/core';

const props = withDefaults(defineProps<StaticSquircleProps>(), {
    as: 'div',
    cornerSmoothing: 0.6
});
defineSlots<StaticSquircleSlots>();

const el = useTemplateRef<HTMLDivElement>('el');
const { width, height } = useElementSize(el);

const path = computed(() => getSvgPath({
        width: width.value,
        height: height.value,
        cornerRadius: props.cornerRadius,
        cornerSmoothing: props.cornerSmoothing
    })
);
</script>

<template>
    <component
        :is="as"
        ref="el"
        v-bind="props"
        :style="{
            borderRadius: cornerRadius,
            width: width,
            height: height,
            clipPath: `path('${path}')`,
        }"
        :data-squircle="cornerRadius"
    >
        <slot />
    </component>
</template>
