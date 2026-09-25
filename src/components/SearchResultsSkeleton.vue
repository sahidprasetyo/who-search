<script setup lang="ts">
import BaseSkeleton from '@/components/BaseSkeleton.vue'
import type { SearchResultsSkeletonProps } from '@/types'

withDefaults(defineProps<SearchResultsSkeletonProps>(), {
  rows: 4,
})

const titleWidths = ['w-3/4', 'w-3/5', 'w-4/5', 'w-2/3']
const snippetWidths = ['w-full', 'w-11/12', 'w-5/6', 'w-4/5']
</script>

<template>
  <div
    class="p-4 sm:p-6 flex flex-col gap-3"
    aria-busy="true"
    aria-live="polite"
    role="status"
  >
    <!-- Loading indicator label -->
    <div class="flex items-center gap-2.5 text-caption text-charcoal/70 mb-1">
      <span
        class="inline-block w-4 h-4 rounded-full border-2 border-charcoal border-t-transparent animate-spin shrink-0"
        aria-hidden="true"
      />
      <span class="font-medium">Searching...</span>
    </div>

    <!-- Table / List Geometry Skeleton -->
    <div
      class="border-2 border-charcoal rounded-cards overflow-hidden bg-cream-paper/60 dark:bg-surface-card/60 shadow-subtle"
    >
      <!-- Header Skeleton -->
      <div
        class="bg-dew-drop border-b-2 border-charcoal py-2.5 px-3 sm:px-4 flex items-center justify-between gap-3"
      >
        <div class="w-10 sm:w-12 flex justify-center">
          <BaseSkeleton class="w-5 h-3.5" rounded="sm" />
        </div>
        <div class="flex-1">
          <BaseSkeleton class="w-28 h-3.5" rounded="sm" />
        </div>
        <div class="hidden md:block flex-1 max-w-xs">
          <BaseSkeleton class="w-16 h-3.5" rounded="sm" />
        </div>
        <div class="w-20 sm:w-28 flex justify-end">
          <BaseSkeleton class="w-12 h-3.5" rounded="sm" />
        </div>
      </div>

      <!-- Row Skeletons mirroring SearchApi.io organic result geometry -->
      <div class="divide-y divide-charcoal/10">
        <div
          v-for="index in rows"
          :key="index"
          class="py-3.5 px-3 sm:px-4 flex items-start justify-between gap-3 min-h-[64px]"
        >
          <!-- Index Column -->
          <div class="w-10 sm:w-12 flex justify-center pt-1">
            <BaseSkeleton class="w-4 h-4" rounded="full" />
          </div>

          <!-- Content Column (Favicon, Domain, Title, Snippet) -->
          <div class="flex-1 flex flex-col gap-1.5 min-w-0">
            <!-- Favicon & Domain skeleton -->
            <div class="flex items-center gap-2">
              <BaseSkeleton class="w-3.5 h-3.5 shrink-0" rounded="sm" />
              <BaseSkeleton class="w-24 h-3" rounded="sm" />
            </div>

            <!-- Title skeleton -->
            <BaseSkeleton
              class="h-4.5"
              :class="titleWidths[(index - 1) % titleWidths.length]"
              rounded="inputs"
            />

            <!-- Snippet skeleton (Desktop) -->
            <div class="hidden md:flex flex-col gap-1 pt-0.5">
              <BaseSkeleton
                class="h-3.5"
                :class="snippetWidths[(index - 1) % snippetWidths.length]"
                rounded="inputs"
              />
            </div>
          </div>

          <!-- Action Column -->
          <div class="w-20 sm:w-28 flex justify-end pt-1">
            <BaseSkeleton class="w-12 h-4" rounded="tags" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
