<script setup lang="ts">
import PillButton from '@/components/PillButton.vue'
import { useNavigationStore } from '@/stores/useNavigationStore'

interface Props {
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Famous Personalities Explorer',
  subtitle: 'Wikipedia Search & Viewer',
})

const emit = defineEmits<{
  toggleDrawer: []
}>()

const navStore = useNavigationStore()

function handleToggle(): void {
  emit('toggleDrawer')
  navStore.toggleMobileDrawer()
}
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <!-- Left: Brand mark & Title -->
    <div class="flex items-center gap-3">
      <!-- Mobile Hamburger Button (< md) -->
      <button
        type="button"
        class="md:hidden inline-flex items-center justify-center p-2 rounded-[8px] border border-charcoal/30 bg-cream-paper text-charcoal hover:bg-dew-drop transition-colors focus:outline-none"
        aria-label="Toggle navigation categories"
        @click="handleToggle"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Brand Mark -->
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-charcoal text-cream-paper flex items-center justify-center text-body-sm font-bold shadow-subtle">
          &#10022;
        </div>
        <div>
          <h1 class="text-heading-sm font-semibold text-cocoa-ink leading-tight tracking-tight">
            {{ title }}
          </h1>
          <p class="text-caption text-charcoal/60 hidden sm:block">
            {{ subtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- Right CTA (Matches DESIGN.md Top-right Action) -->
    <div class="flex items-center gap-2">
      <PillButton
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Docs & Code</span>
      </PillButton>
    </div>
  </div>
</template>
