<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  as?: string
  variant?: 'canvas' | 'tint'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  variant: 'canvas',
  padding: 'md',
})

const variantClass = computed<string>(() => {
  return props.variant === 'tint' ? 'bg-dew-drop' : 'bg-cream-paper'
})

const paddingClass = computed<string>(() => {
  switch (props.padding) {
    case 'none':
      return 'p-0'
    case 'sm':
      return 'p-3 sm:p-4'
    case 'lg':
      return 'p-6 sm:p-8'
    case 'md':
    default:
      return 'p-4 sm:p-6'
  }
})
</script>

<template>
  <component
    :is="as"
    class="rounded-cards border-[1.5px] border-charcoal/20 shadow-lg transition-colors overflow-hidden"
    :class="[variantClass, paddingClass]"
  >
    <div v-if="$slots.header" class="mb-3 border-b border-charcoal/10 pb-3">
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" class="mt-3 border-t border-charcoal/10 pt-3">
      <slot name="footer" />
    </div>
  </component>
</template>
