<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
 
import type { SkeletonProps } from '@/types'
import BaseSkeleton from './BaseSkeleton.vue'

const props = defineProps<SkeletonProps>()
</script>

<template>
  <BaseSkeleton v-bind="props">
    <slot />
  </BaseSkeleton>
</template>
