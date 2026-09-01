<script setup lang="ts">
import BaseSkeleton from '@/components/BaseSkeleton.vue'

interface Props {
  rows?: number
}

withDefaults(defineProps<Props>(), {
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
      <span class="font-medium">Searching Wikipedia...</span>
    </div>

    <!-- Table Geometry Skeleton -->
    <div class="border border-charcoal/10 rounded-cards overflow-hidden bg-cream-paper/60">
      <!-- Table Header Skeleton -->
      <div
        class="bg-dew-drop/90 border-b border-charcoal/15 py-2.5 px-3 sm:px-4 flex items-center justify-between gap-3"
      >
        <div class="w-10 sm:w-12 flex justify-center">
          <BaseSkeleton class="w-5 h-3.5" rounded="sm" />
        </div>
        <div class="flex-1">
          <BaseSkeleton class="w-24 h-3.5" rounded="sm" />
        </div>
        <div class="hidden md:block flex-1 max-w-xs">
          <BaseSkeleton class="w-16 h-3.5" rounded="sm" />
        </div>
        <div class="w-20 sm:w-28 flex justify-end">
          <BaseSkeleton class="w-12 h-3.5" rounded="sm" />
        </div>
      </div>

      <!-- Table Row Skeletons -->
      <div class="divide-y divide-charcoal/10">
        <div
          v-for="index in rows"
          :key="index"
          class="py-3.5 px-3 sm:px-4 flex items-center justify-between gap-3 min-h-[52px]"
        >
          <!-- Index Column -->
          <div class="w-10 sm:w-12 flex justify-center">
            <BaseSkeleton class="w-4 h-4" rounded="full" />
          </div>

          <!-- Title Column -->
          <div class="flex-1">
            <BaseSkeleton
              class="h-4.5"
              :class="titleWidths[(index - 1) % titleWidths.length]"
              rounded="inputs"
            />
          </div>

          <!-- Snippet Column (Desktop) -->
          <div class="hidden md:block flex-1 max-w-xs">
            <BaseSkeleton
              class="h-3.5"
              :class="snippetWidths[(index - 1) % snippetWidths.length]"
              rounded="inputs"
            />
          </div>

          <!-- Action Column -->
          <div class="w-20 sm:w-28 flex justify-end">
            <BaseSkeleton class="w-12 h-4" rounded="tags" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
