<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppLayout from '@/components/AppLayout.vue'
import CategoryAccordion from '@/components/CategoryAccordion.vue'
import ContentViewer from '@/components/ContentViewer.vue'
import MobileDrawer from '@/components/MobileDrawer.vue'
import SearchResultsViewer from '@/components/SearchResultsViewer.vue'
import { usePersonalitiesApp } from '@/composables/usePersonalitiesApp'
import { useTheme } from '@/composables/useTheme'

// Reactive store coordination extracted to composable
usePersonalitiesApp()

const { initTheme } = useTheme()
onMounted(() => {
  initTheme()
})
</script>

<template>
  <AppLayout>
    <!-- Header Slot -->
    <template #header>
      <AppHeader />
    </template>

    <!-- Left Pane Navigation Slot (Desktop) -->
    <template #navigation>
      <CategoryAccordion />
    </template>

    <!-- Top-Right Pane Slot -->
    <template #topContent>
      <SearchResultsViewer />
    </template>

    <!-- Bottom-Right Pane Slot -->
    <template #bottomContent>
      <ContentViewer />
    </template>

    <!-- Mobile Drawer Navigation Slot -->
    <template #drawer>
      <MobileDrawer>
        <CategoryAccordion />
      </MobileDrawer>
    </template>

    <!-- Footer Brand Band (Matches DESIGN.md footer token) -->
    <template #footer>
      <div
        class="w-full bg-marker-orange text-charcoal py-4 sm:py-5 px-4 sm:px-6 rounded-t-footer mt-12 sm:mt-16 text-center"
      >
        <p class="text-xs sm:text-caption font-medium">
          Famous Personalities Explorer &bull; Powered by DuckDuckGo Search via SearchApi.io &bull;
          Vue 3 + Tailwind CSS v4
        </p>
      </div>
    </template>
  </AppLayout>
</template>
