<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
 
import BaseSkeleton from './BaseSkeleton.vue'

interface Props {
  as?: string
  width?: string
  height?: string
  rounded?: 'none' | 'sm' | 'inputs' | 'cards' | 'buttons' | 'tags' | 'footer' | 'full'
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <BaseSkeleton v-bind="props">
    <slot />
  </BaseSkeleton>
</template>
