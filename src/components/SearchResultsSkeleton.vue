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
  <div class="p-4 sm:p-6 flex flex-col gap-4" aria-busy="true" aria-live="polite" role="status">
    <!-- Loading indicator label -->
    <div class="flex items-center gap-3 px-4 pt-2 text-caption text-charcoal/70">
      <span
        class="inline-block w-4 h-4 rounded-full border-2 border-charcoal border-t-transparent animate-spin motion-reduce:animate-none shrink-0"
        aria-hidden="true"
      />
      <span class="font-medium">Searching...</span>
    </div>

    <!-- Row skeletons mirroring the result list geometry (rank, domain, title, snippet) -->
    <div
      v-for="index in rows"
      :key="index"
      data-testid="skeleton-row"
      class="flex gap-4 p-4"
    >
      <BaseSkeleton class="w-5 h-4 shrink-0" rounded="sm" />
      <div class="flex-1 flex flex-col gap-2.5 min-w-0">
        <div class="flex items-center gap-2">
          <BaseSkeleton class="w-4 h-4 shrink-0" rounded="sm" />
          <BaseSkeleton class="w-24 h-3" rounded="sm" />
        </div>
        <BaseSkeleton class="h-5" :class="titleWidths[(index - 1) % titleWidths.length]" />
        <BaseSkeleton class="h-3.5" :class="snippetWidths[(index - 1) % snippetWidths.length]" />
      </div>
    </div>
  </div>
</template>
