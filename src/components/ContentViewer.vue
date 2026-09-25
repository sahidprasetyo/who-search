<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import ArticleContentSkeleton from '@/components/ArticleContentSkeleton.vue'
import PillButton from '@/components/PillButton.vue'
import SurfaceCard from '@/components/SurfaceCard.vue'
import { useIframePreview } from '@/composables/useIframePreview'
import { useSearchStore } from '@/stores/useSearchStore'
import type { ContentViewerEmits, ContentViewerProps } from '@/types'

const props = withDefaults(defineProps<ContentViewerProps>(), {
  articleTitle: undefined,
  articleUrl: undefined,
})

const emit = defineEmits<ContentViewerEmits>()

const searchStore = useSearchStore()
const { selectedResult, selectedTargetUrl } = storeToRefs(searchStore)

const currentTitle = computed(
  () => props.title ?? props.articleTitle ?? selectedResult.value?.title ?? '',
)
const currentUrl = computed(() => {
  if (props.url !== undefined) {
    return props.url
  }
  if (props.articleUrl !== undefined) {
    return props.articleUrl
  }
  return selectedTargetUrl.value
})

// Presentational iframe state encapsulated in dedicated composable
const { isIframeLoading, handleIframeLoad } = useIframePreview(currentUrl)

function handleOpenExternal(): void {
  if (currentUrl.value) {
    emit('openExternal', currentUrl.value)
  }
}
</script>

<template>
  <SurfaceCard variant="canvas" padding="none">
    <!-- Header -->
    <template #header>
      <div
        class="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-cream-paper dark:bg-surface-card"
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span
              class="inline-block w-3 h-3 rounded-sm bg-sprout-sticker border border-charcoal shadow-[1px_1px_0px_0px_var(--color-charcoal)] shrink-0"
              aria-hidden="true"
            />
            <h3 class="text-body sm:text-subheading font-black text-charcoal truncate">
              {{ currentTitle || 'Article Preview' }}
            </h3>
          </div>
          <p
            v-if="currentUrl"
            class="text-xs sm:text-caption text-charcoal/80 truncate mt-0.5 font-mono font-medium"
          >
            {{ currentUrl }}
          </p>
        </div>

        <div v-if="currentUrl" class="flex items-center gap-2 shrink-0">
          <PillButton
            :href="currentUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click="handleOpenExternal"
          >
            <span class="flex items-center gap-1.5 font-bold">
              <span>Open in New Tab</span>
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </span>
          </PillButton>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div
      v-if="!currentUrl"
      class="h-72 sm:h-84 md:h-96 flex flex-col items-center justify-center p-6 sm:p-8 text-center text-charcoal/70"
    >
      <div class="p-4 border-2 border-charcoal bg-dew-drop shadow-subtle mb-4 rounded-inputs">
        <svg
          class="w-12 h-12 text-charcoal"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <p class="text-body-sm font-bold max-w-sm text-charcoal">
        Select a search result from above to preview the article.
      </p>
    </div>

    <!-- Active Iframe Container -->
    <div v-else class="relative w-full overscroll-contain">
      <!-- Fallback Info Notice Banner (for iframe embedding edge cases) -->
      <div
        class="px-4 sm:px-6 py-2.5 bg-dew-drop border-b-2 border-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-caption text-charcoal font-medium"
      >
        <span class="flex items-center gap-1.5 text-xs sm:text-caption font-bold">
          <span class="bg-marker-orange text-white px-1.5 py-0.5 rounded-sm text-xs font-black border border-charcoal">NOTE</span>
          If preview does not load due to site security headers, use "Open in New Tab".
        </span>
        <a
          :href="currentUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs sm:text-caption font-bold text-marker-orange hover:underline shrink-0"
        >
          Open direct link &rarr;
        </a>
      </div>

      <!-- Iframe Loading Overlay with Article Skeleton Preview -->
      <div
        v-if="isIframeLoading"
        class="absolute inset-0 top-10 bg-cream-paper z-10 flex flex-col justify-start overflow-hidden"
        aria-busy="true"
        aria-live="polite"
      >
        <!-- Floating loading pill -->
        <div class="absolute inset-x-0 top-6 flex justify-center z-20 pointer-events-none">
          <div
            class="flex items-center gap-2 text-caption text-charcoal font-bold bg-dew-drop px-4 py-2 rounded-buttons border-2 border-charcoal shadow-subtle"
          >
            <span
              class="inline-block w-4 h-4 rounded-full border-2 border-charcoal border-t-transparent animate-spin shrink-0"
              aria-hidden="true"
            />
            <span>Loading preview content...</span>
          </div>
        </div>

        <!-- Geometric layout skeleton -->
        <ArticleContentSkeleton />
      </div>

      <!-- Iframe Content with responsive height -->
      <iframe
        :key="currentUrl"
        :src="currentUrl"
        :title="currentTitle ? `${currentTitle} Preview Page` : 'Web Page Preview'"
        class="w-full h-[380px] sm:h-[460px] md:h-[540px] border-0 bg-white dark:bg-cream-paper"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        loading="lazy"
        @load="handleIframeLoad"
      />
    </div>
  </SurfaceCard>
</template>
