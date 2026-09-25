<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '@/stores/useNavigationStore'
import type { MobileDrawerEmits, MobileDrawerProps } from '@/types'

const props = withDefaults(defineProps<MobileDrawerProps>(), {
  isOpen: undefined,
})

const emit = defineEmits<MobileDrawerEmits>()

const navStore = useNavigationStore()
const { isMobileDrawerOpen } = storeToRefs(navStore)

const activeIsOpen = computed(() =>
  props.isOpen !== undefined ? props.isOpen : isMobileDrawerOpen.value,
)

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
      v-if="activeIsOpen"
      class="fixed inset-0 z-40 bg-charcoal/70 transition-opacity md:hidden"
      aria-hidden="true"
      @click="handleClose"
    />

    <!-- Drawer Panel -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-xs sm:max-w-sm bg-cream-paper border-r-2 sm:border-r-[3px] border-charcoal p-4 sm:p-5 shadow-lg flex flex-col transition-transform duration-300 ease-in-out md:hidden"
      :class="[
        activeIsOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation drawer"
    >
      <!-- Drawer Header -->
      <div class="flex items-center justify-between pb-3.5 mb-3.5 border-b-2 border-charcoal">
        <h2 class="text-subheading font-black text-charcoal">Categories</h2>
        <button
          type="button"
          class="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-inputs border-2 border-charcoal text-charcoal bg-cream-paper hover:bg-dew-drop shadow-subtle active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-charcoal"
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
              stroke-width="2.5"
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
