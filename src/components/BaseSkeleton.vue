<script setup lang="ts">
import { computed } from 'vue'
import type { SkeletonProps } from '@/types'

const props = withDefaults(defineProps<SkeletonProps>(), {
  as: 'div',
  width: undefined,
  height: undefined,
  rounded: 'inputs',
  class: '',
})

const roundedClass = computed(() => {
  switch (props.rounded) {
    case 'none':
      return 'rounded-none'
    case 'sm':
      return 'rounded-sm'
    case 'cards':
      return 'rounded-cards'
    case 'buttons':
      return 'rounded-buttons'
    case 'tags':
      return 'rounded-tags'
    case 'footer':
      return 'rounded-footer'
    case 'full':
      return 'rounded-full'
    case 'inputs':
    default:
      return 'rounded-inputs'
  }
})
</script>

<template>
  <component
    :is="as"
    class="animate-pulse motion-reduce:animate-none bg-charcoal/10 dark:bg-charcoal/15"
    :class="[roundedClass, props.class]"
    :style="{
      width: width,
      height: height,
    }"
    aria-hidden="true"
  >
    <slot />
  </component>
</template>
