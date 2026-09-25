<script setup lang="ts">
import BaseSkeleton from '@/components/BaseSkeleton.vue'
</script>

<template>
  <div
    class="w-full h-full p-6 sm:p-8 flex flex-col gap-8 bg-surface-card overflow-hidden"
    aria-hidden="true"
  >
    <!-- Article Header Skeleton -->
    <div class="flex flex-col gap-3 pb-6 border-b-2 border-charcoal/15">
      <BaseSkeleton class="h-7 sm:h-9 w-3/5" rounded="inputs" />
      <BaseSkeleton class="h-4 w-2/5" rounded="sm" />
    </div>

    <!-- Article Body with simulated infobox and text -->
    <div class="flex flex-col md:flex-row gap-6 items-start">
      <!-- Paragraph Content Lines -->
      <div class="flex-1 w-full flex flex-col gap-3">
        <BaseSkeleton class="h-4 w-full" rounded="sm" />
        <BaseSkeleton class="h-4 w-[96%]" rounded="sm" />
        <BaseSkeleton class="h-4 w-[92%]" rounded="sm" />
        <BaseSkeleton class="h-4 w-[85%]" rounded="sm" />
        <BaseSkeleton class="h-4 w-[90%]" rounded="sm" />

        <div class="pt-4 flex flex-col gap-3">
          <BaseSkeleton class="h-5 w-1/3 mb-1" rounded="inputs" />
          <BaseSkeleton class="h-4 w-full" rounded="sm" />
          <BaseSkeleton class="h-4 w-[94%]" rounded="sm" />
          <BaseSkeleton class="h-4 w-[88%]" rounded="sm" />
        </div>
      </div>

      <!-- Simulated Profile Infobox Card -->
      <div
        class="hidden sm:flex flex-col gap-3 w-40 md:w-48 shrink-0 p-4 rounded-cards bg-charcoal/5"
      >
        <BaseSkeleton class="w-full h-32 rounded-cards" />
        <BaseSkeleton class="h-3 w-3/4 mx-auto" rounded="sm" />
        <div class="flex flex-col gap-2 pt-3 border-t border-charcoal/15">
          <BaseSkeleton class="h-3 w-full" rounded="sm" />
          <BaseSkeleton class="h-3 w-4/5" rounded="sm" />
          <BaseSkeleton class="h-3 w-3/5" rounded="sm" />
        </div>
      </div>
    </div>
  </div>
</template>
