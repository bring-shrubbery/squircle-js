<script lang="ts">
export interface SquircleProps {
    /**
     * The element or component this component should render as when not a div.
     * @defaultValue 'div'
     */
    as?: any;
    cornerSmoothing?: number;
    cornerRadius?: number;
    width?: number;
    height?: number;
    defaultWidth?: number;
    defaultHeight?: number;
}

export interface SquircleSlots {
    default(props?: {}): any;
}
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { getSvgPath } from 'figma-squircle';
import { useElementSize } from '@vueuse/core';

const props = withDefaults(defineProps<SquircleProps>(), {
    as: 'div',
    cornerSmoothing: 0.6
});
defineSlots<SquircleSlots>();

const el = useTemplateRef<HTMLDivElement>('el');
const { width, height } = useElementSize(el);

const actualWidth = computed(() => props.width ?? width.value ?? props.defaultWidth);
const actualHeight = computed(() => props.height ?? height.value ?? props.defaultHeight);

const path = computed(() => getSvgPath({
        width: actualWidth.value,
        height: actualHeight.value,
        cornerRadius: props.cornerRadius,
        cornerSmoothing: props.cornerSmoothing
    })
);
</script>

<template>
    <component
        :is="as"
        ref="el"
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
