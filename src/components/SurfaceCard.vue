<script setup lang="ts">
import { computed } from 'vue'
import type { SurfaceCardProps } from '@/types'

const props = withDefaults(defineProps<SurfaceCardProps>(), {
  as: 'div',
  variant: 'canvas',
  padding: 'md',
})

const variantClass = computed<string>(() => {
  return props.variant === 'tint' ? 'bg-dew-drop' : 'bg-surface-card'
})

const paddingClass = computed<string>(() => {
  switch (props.padding) {
    case 'none':
      return 'p-0'
    case 'sm':
      return 'p-4 sm:p-6'
    case 'lg':
      return 'p-8 sm:p-10'
    case 'md':
    default:
      return 'p-6 sm:p-8'
  }
})
</script>

<template>
  <component
    :is="as"
    class="rounded-cards border-2 border-charcoal shadow-card transition-colors overflow-hidden"
    :class="[variantClass, paddingClass]"
  >
    <div
      v-if="$slots.header"
      class="border-b-2 border-charcoal"
      :class="{ 'mb-6 pb-6': padding !== 'none' }"
    >
      <slot name="header" />
    </div>
    <slot />
    <div
      v-if="$slots.footer"
      class="border-t-2 border-charcoal"
      :class="{ 'mt-6 pt-6': padding !== 'none' }"
    >
      <slot name="footer" />
    </div>
  </component>
</template>
