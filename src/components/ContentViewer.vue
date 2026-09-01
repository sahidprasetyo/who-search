<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PillButton from '@/components/PillButton.vue'
import SurfaceCard from '@/components/SurfaceCard.vue'
import { useSearchStore } from '@/stores/useSearchStore'

interface Props {
  articleTitle?: string
  articleUrl?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  articleTitle: undefined,
  articleUrl: undefined,
})

const emit = defineEmits<{
  openExternal: [url: string]
}>()

const searchStore = useSearchStore()

const currentTitle = computed(() => props.articleTitle ?? searchStore.selectedResult?.title ?? '')
const currentUrl = computed(() =>
  props.articleUrl !== undefined ? props.articleUrl : searchStore.selectedArticleUrl,
)

const isIframeLoading = ref<boolean>(true)

// Reset iframe loading whenever the target URL changes
watch(currentUrl, () => {
  if (currentUrl.value) {
    isIframeLoading.value = true
  }
})

function handleIframeLoad(): void {
  isIframeLoading.value = false
}

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
        class="px-5 pt-3 pb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span
              class="inline-block w-2.5 h-2.5 rounded-full bg-sprout-sticker"
              aria-hidden="true"
            />
            <h3 class="text-subheading font-semibold text-cocoa-ink truncate">
              {{ currentTitle || 'Article Preview' }}
            </h3>
          </div>
          <p v-if="currentUrl" class="text-caption text-charcoal/60 truncate mt-0.5 font-mono">
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
            <span class="flex items-center gap-1.5">
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
                  stroke-width="2"
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
      class="h-96 flex flex-col items-center justify-center p-8 text-center text-charcoal/60"
    >
      <svg
        class="w-12 h-12 mb-3 text-charcoal/30"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
      <p class="text-body-sm font-medium">
        Select a search result from above to preview the article.
      </p>
    </div>

    <!-- Active Iframe Container -->
    <div v-else class="relative w-full">
      <!-- Fallback Info Notice Banner (for iframe embedding edge cases) -->
      <div
        class="px-4 py-2 bg-dew-drop/90 border-b border-charcoal/10 flex items-center justify-between text-caption text-charcoal/80"
      >
        <span class="flex items-center gap-1.5">
          <span class="text-marker-orange font-bold">Note:</span>
          If preview does not load due to site security headers, use "Open in New Tab".
        </span>
        <a
          :href="currentUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-marker-orange hover:underline shrink-0 ml-2"
        >
          Open direct link &rarr;
        </a>
      </div>

      <!-- Iframe Spinner Overlay -->
      <div
        v-if="isIframeLoading"
        class="absolute inset-0 top-10 bg-cream-paper/80 backdrop-blur-xs flex items-center justify-center z-10"
        aria-busy="true"
        aria-live="polite"
      >
        <div
          class="flex items-center gap-2 text-caption text-charcoal/70 bg-cream-paper px-4 py-2 rounded-full border border-charcoal/20 shadow-sm"
        >
          <span
            class="inline-block w-4 h-4 rounded-full border-2 border-charcoal border-t-transparent animate-spin"
          />
          Loading article content...
        </div>
      </div>

      <!-- Iframe Content -->
      <iframe
        :key="currentUrl"
        :src="currentUrl"
        :title="currentTitle ? `${currentTitle} Wikipedia Page` : 'Wikipedia Article'"
        class="w-full h-[520px] border-0 bg-white"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        loading="lazy"
        @load="handleIframeLoad"
      />
    </div>
  </SurfaceCard>
</template>
