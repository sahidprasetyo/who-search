<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  href?: string
  target?: string
  rel?: string
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  href: undefined,
  target: undefined,
  rel: undefined,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

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
    class="inline-flex items-center justify-center min-h-[40px] sm:min-h-[44px] rounded-buttons border-[1.5px] border-charcoal bg-cream-paper px-4 py-2 sm:px-7 sm:py-2.5 text-caption font-medium text-charcoal shadow-subtle transition-transform active:translate-y-0.5 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
    :class="{ 'pointer-events-none opacity-50': disabled }"
    @click="handleClick"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center min-h-[40px] sm:min-h-[44px] rounded-buttons border-[1.5px] border-charcoal bg-cream-paper px-4 py-2 sm:px-7 sm:py-2.5 text-caption font-medium text-charcoal shadow-subtle transition-transform active:translate-y-0.5 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
