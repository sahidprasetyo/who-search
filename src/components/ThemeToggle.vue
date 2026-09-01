<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] inline-flex items-center justify-center rounded-buttons border-[1.5px] border-charcoal/30 hover:border-charcoal bg-cream-paper text-charcoal shadow-subtle transition-all active:translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-charcoal/20"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <!-- Sun icon shown when Dark mode is active (click to switch to Light) -->
    <svg
      v-if="isDark"
      class="w-4 h-4 text-marker-orange transition-transform duration-300 rotate-0 hover:rotate-45"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>

    <!-- Moon icon shown when Light mode is active (click to switch to Dark) -->
    <svg
      v-else
      class="w-4 h-4 text-charcoal/80 transition-transform duration-300 hover:-rotate-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>
