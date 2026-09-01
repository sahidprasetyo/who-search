<script setup lang="ts">
import BaseSkeleton from '@/components/BaseSkeleton.vue'

interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 3,
})
</script>

<template>
  <div
    class="flex flex-col gap-3"
    aria-busy="true"
    aria-live="polite"
    role="status"
  >
    <div
      v-for="i in count"
      :key="i"
      class="rounded-cards border-[1.5px] border-charcoal/15 bg-cream-paper dark:bg-surface-card shadow-sm overflow-hidden p-4"
    >
      <div class="flex items-center justify-between">
        <BaseSkeleton class="h-6 w-32" rounded="inputs" />
        <BaseSkeleton class="w-5 h-5" rounded="full" />
      </div>
    </div>
  </div>
</template>
