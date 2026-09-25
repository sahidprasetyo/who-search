<script setup lang="ts">
import BaseSkeleton from '@/components/BaseSkeleton.vue'
import type { CategoryListSkeletonProps } from '@/types'

withDefaults(defineProps<CategoryListSkeletonProps>(), {
  count: 3,
})
</script>

<template>
  <div
    class="flex flex-col gap-5"
    aria-busy="true"
    aria-live="polite"
    role="status"
  >
    <div
      v-for="i in count"
      :key="i"
      class="rounded-cards border-2 border-charcoal bg-lilac-block shadow-card overflow-hidden px-6 py-5"
    >
      <div class="flex items-center justify-between">
        <BaseSkeleton class="h-6 w-32" rounded="inputs" />
        <BaseSkeleton class="w-5 h-5" rounded="full" />
      </div>
    </div>
  </div>
</template>
