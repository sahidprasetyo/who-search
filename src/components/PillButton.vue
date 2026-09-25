<script setup lang="ts">
import type { PillButtonEmits, PillButtonProps } from '@/types'

withDefaults(defineProps<PillButtonProps>(), {
  type: 'button',
  disabled: false,
  href: undefined,
  target: undefined,
  rel: undefined,
})

const emit = defineEmits<PillButtonEmits>()

function handleClick(event: MouseEvent): void {
  emit('click', event)
}
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :rel="target === '_blank' && !rel ? 'noopener noreferrer' : rel"
    class="inline-flex items-center justify-center min-h-[40px] sm:min-h-[44px] rounded-buttons border-2 border-charcoal bg-cream-paper hover:bg-dew-drop px-4 py-2 sm:px-7 sm:py-2.5 text-caption font-bold text-charcoal shadow-subtle hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 cursor-pointer disabled:pointer-events-none disabled:opacity-50 select-none"
    :class="{ 'pointer-events-none opacity-50': disabled }"
    @click="handleClick"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center min-h-[40px] sm:min-h-[44px] rounded-buttons border-2 border-charcoal bg-cream-paper hover:bg-dew-drop px-4 py-2 sm:px-7 sm:py-2.5 text-caption font-bold text-charcoal shadow-subtle hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 cursor-pointer disabled:pointer-events-none disabled:opacity-50 select-none"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
