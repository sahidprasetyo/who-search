<script setup lang="ts">
import ApiKeyButton from '@/components/ApiKeyButton.vue'
import PillButton from '@/components/PillButton.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useNavigationStore } from '@/stores/useNavigationStore'

import type { AppHeaderEmits, AppHeaderProps } from '@/types'

withDefaults(defineProps<AppHeaderProps>(), {
  title: 'Famous Personalities Explorer',
  subtitle: 'Web Search & Viewer',
})

const emit = defineEmits<AppHeaderEmits>()

const navStore = useNavigationStore()

function handleToggle(): void {
  emit('toggleDrawer')
  navStore.toggleMobileDrawer()
}
</script>

<template>
  <div class="flex items-center justify-between w-full gap-2 sm:gap-4">
    <!-- Left: Brand mark & Title -->
    <div class="flex items-center gap-2 sm:gap-4 min-w-0">
      <!-- Mobile Hamburger Button (< md) -->
      <button
        type="button"
        class="neo-control md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2 bg-surface-card text-charcoal hover:bg-dew-drop shrink-0"
        aria-label="Toggle navigation categories"
        @click="handleToggle"
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Brand Mark -->
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <div
          class="w-9 h-9 rounded-inputs border-2 border-charcoal bg-marker-orange text-on-accent flex items-center justify-center text-body-sm font-black shadow-card shrink-0 select-none"
          aria-hidden="true"
        >
          &#10022;
        </div>
        <div class="min-w-0">
          <h1
            class="text-body sm:text-heading-sm font-black text-charcoal leading-tight tracking-tight truncate"
          >
            {{ title }}
          </h1>
          <p class="text-caption text-charcoal/70 font-normal hidden sm:block truncate">
            {{ subtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- Right Actions: Theme Toggle & Docs CTA -->
    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <ApiKeyButton />
      <ThemeToggle />
      <!-- Hidden on phones so the header fits a 360px viewport -->
      <div class="hidden sm:block">
        <PillButton href="https://github.com" target="_blank" rel="noopener noreferrer">
          <span class="flex items-center gap-1.5 font-bold">
            <span>Docs &amp; Code</span>
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </span>
        </PillButton>
      </div>
    </div>
  </div>
</template>
