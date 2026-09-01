<script setup lang="ts">
import { useNavigationStore } from '@/stores/useNavigationStore'

interface Props {
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: undefined,
})

const emit = defineEmits<{
  close: []
}>()

const navStore = useNavigationStore()

function handleClose(): void {
  emit('close')
  if (props.isOpen === undefined) {
    navStore.setMobileDrawerOpen(false)
  }
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop Overlay -->
    <div
      v-if="props.isOpen ?? navStore.isMobileDrawerOpen"
      class="fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-sm transition-opacity md:hidden"
      aria-hidden="true"
      @click="handleClose"
    />

    <!-- Drawer Panel -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-xs sm:max-w-sm bg-cream-paper border-r-[1.5px] border-charcoal p-4 sm:p-5 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden"
      :class="[
        (props.isOpen ?? navStore.isMobileDrawerOpen) ? 'translate-x-0' : '-translate-x-full',
      ]"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation drawer"
    >
      <!-- Drawer Header -->
      <div class="flex items-center justify-between pb-3.5 mb-3.5 border-b border-charcoal/15">
        <h2 class="text-subheading font-semibold text-cocoa-ink">Categories</h2>
        <button
          type="button"
          class="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-inputs border border-charcoal/20 text-charcoal hover:bg-dew-drop transition-colors focus:outline-none focus:ring-2 focus:ring-charcoal/20 cursor-pointer"
          aria-label="Close navigation"
          @click="handleClose"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Drawer Content Slot -->
      <div class="flex-1 overflow-y-auto overscroll-contain pr-1">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
