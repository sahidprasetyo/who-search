<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppLayout from '@/components/AppLayout.vue'
import CategoryAccordion from '@/components/CategoryAccordion.vue'
import ContentViewer from '@/components/ContentViewer.vue'
import MobileDrawer from '@/components/MobileDrawer.vue'
import SearchResultsViewer from '@/components/SearchResultsViewer.vue'
import { usePersonalitiesApp } from '@/composables/usePersonalitiesApp'

// Reactive store coordination and theme lifecycle managed via orchestration composable
usePersonalitiesApp()
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
  </AppLayout>
</template>
