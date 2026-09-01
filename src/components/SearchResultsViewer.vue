<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import PillButton from '@/components/PillButton.vue'
import SearchResultsSkeleton from '@/components/SearchResultsSkeleton.vue'
import SurfaceCard from '@/components/SurfaceCard.vue'
import { useNavigationStore } from '@/stores/useNavigationStore'
import { useSearchStore } from '@/stores/useSearchStore'
import type { SearchResultItem, SearchResultsViewerEmits, SearchResultsViewerProps } from '@/types'
import { formatDomain, stripHtmlTags } from '@/utils'

const props = withDefaults(defineProps<SearchResultsViewerProps>(), {
  results: undefined,
  selectedResult: undefined,
  isLoading: undefined,
  error: undefined,
  personName: undefined,
  personTitle: undefined,
})

const emit = defineEmits<SearchResultsViewerEmits>()

const searchStore = useSearchStore()
const navStore = useNavigationStore()

// Direct reactive consumption of store state via storeToRefs (SSOT)
const {
  results: storeResults,
  selectedResult: storeSelectedResult,
  isLoading: storeIsLoading,
  error: storeError,
} = storeToRefs(searchStore)
const { selectedPerson } = storeToRefs(navStore)

const activeResults = computed(() => props.results ?? storeResults.value)
const activeSelectedResult = computed(() =>
  props.selectedResult !== undefined ? props.selectedResult : storeSelectedResult.value,
)
const loading = computed(() => props.isLoading ?? storeIsLoading.value)
const errorMessage = computed(() => props.error ?? storeError.value)
const currentPersonName = computed(
  () => props.personName ?? selectedPerson.value?.name ?? 'Famous Personality',
)
const currentPersonTitle = computed(() => props.personTitle ?? selectedPerson.value?.title ?? '')

function isResultSelected(result: SearchResultItem): boolean {
  if (!activeSelectedResult.value) {
    return false
  }
  if (result.link && activeSelectedResult.value.link) {
    return result.link === activeSelectedResult.value.link
  }
  return result.title === activeSelectedResult.value.title
}

function handleSelect(result: SearchResultItem): void {
  emit('selectResult', result)
  if (props.selectedResult === undefined) {
    searchStore.selectResult(result)
  }
}

function handleRetry(): void {
  emit('retry')
  if (props.error === undefined && selectedPerson.value) {
    const query =
      selectedPerson.value.searchQuery ??
      selectedPerson.value.wikiSearchQuery ??
      selectedPerson.value.name
    void searchStore.fetchResultsForPerson(query)
  }
}
</script>

<template>
  <SurfaceCard variant="canvas" padding="none">
    <!-- Card Header -->
    <template #header>
      <div
        class="px-4 sm:px-6 pt-3.5 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span
              class="inline-block w-2.5 h-2.5 rounded-full bg-marker-orange shrink-0"
              aria-hidden="true"
            />
            <h2 class="text-body sm:text-subheading font-semibold text-cocoa-ink truncate">
              {{ currentPersonName }}
            </h2>
          </div>
          <p v-if="currentPersonTitle" class="text-caption text-charcoal/60 mt-0.5 truncate">
            {{ currentPersonTitle }}
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span
            v-if="!loading && activeResults.length > 0"
            class="inline-flex items-center self-start sm:self-auto rounded-tags bg-dew-drop border border-charcoal/20 px-3 py-1 text-caption text-charcoal/80 font-medium"
          >
            {{ activeResults.length }} Results Found
          </span>
        </div>
      </div>
    </template>

    <!-- Loading Skeleton State -->
    <SearchResultsSkeleton v-if="loading" />

    <!-- Error State -->
    <div
      v-else-if="errorMessage"
      class="p-6 text-center flex flex-col items-center justify-center gap-3"
      role="alert"
    >
      <p class="text-body-sm font-medium text-burnt-sienna">
        {{ errorMessage }}
      </p>
      <PillButton type="button" @click="handleRetry"> Try Again </PillButton>
    </div>

    <!-- Empty State -->
    <div v-else-if="activeResults.length === 0" class="p-8 text-center text-charcoal/60">
      <p class="text-body-sm">No search results found on DuckDuckGo for this person.</p>
    </div>

    <!-- Results Table / List (Single-axis scroll with overscroll-contain) -->
    <div v-else class="max-h-[340px] sm:max-h-[380px] overflow-y-auto overscroll-contain">
      <table class="w-full text-left text-body-sm border-collapse">
        <thead
          class="sticky top-0 bg-dew-drop/95 backdrop-blur-sm z-10 border-b border-charcoal/15 text-caption uppercase text-charcoal/70"
        >
          <tr>
            <th scope="col" class="py-2.5 px-3 sm:px-4 w-10 sm:w-12 text-center font-medium">
              No.
            </th>
            <th scope="col" class="py-2.5 px-3 sm:px-4 font-medium">
              DuckDuckGo Search Result
            </th>
            <th scope="col" class="py-2.5 px-4 hidden md:table-cell font-medium">
              Snippet
            </th>
            <th scope="col" class="py-2.5 px-3 sm:px-4 w-20 sm:w-28 text-right font-medium">
              Preview
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-charcoal/10">
          <tr
            v-for="(result, index) in activeResults"
            :key="result.link || index"
            class="group cursor-pointer transition-colors"
            :class="[
              isResultSelected(result)
                ? 'bg-dew-drop font-medium border-l-4 border-l-marker-orange'
                : 'hover:bg-dew-drop/40 border-l-4 border-l-transparent',
            ]"
            @click="handleSelect(result)"
          >
            <!-- Index -->
            <td class="py-3.5 sm:py-3 px-3 sm:px-4 text-center text-caption text-charcoal/70 align-top">
              {{ result.position ?? index + 1 }}
            </td>

            <!-- Result Title & Favicon/Domain -->
            <td class="py-3.5 sm:py-3 px-3 sm:px-4 align-top">
              <div class="flex flex-col gap-1 min-w-0">
                <!-- Favicon & Source Domain -->
                <div class="flex items-center gap-1.5 min-w-0">
                  <img
                    v-if="result.favicon"
                    :src="result.favicon"
                    alt=""
                    class="w-3.5 h-3.5 rounded-sm object-contain shrink-0"
                    loading="lazy"
                    @error="($event.target as HTMLElement).style.display = 'none'"
                  />
                  <span class="text-xs text-charcoal/60 font-mono truncate">
                    {{ result.source || result.displayed_link || formatDomain(result.link) }}
                  </span>
                </div>

                <!-- Title -->
                <div
                  class="font-medium text-cocoa-ink line-clamp-1 group-hover:text-marker-orange transition-colors"
                >
                  {{ result.title }}
                </div>
              </div>
            </td>

            <!-- Snippet Preview -->
            <td class="py-3.5 sm:py-3 px-4 hidden md:table-cell text-caption text-charcoal/70 align-top">
              <div class="line-clamp-2">
                {{ stripHtmlTags(result.snippet) }}
              </div>
            </td>

            <!-- Action -->
            <td class="py-3.5 sm:py-3 px-3 sm:px-4 text-right align-top">
              <span
                class="inline-flex items-center text-caption transition-colors font-medium"
                :class="[
                  isResultSelected(result)
                    ? 'text-marker-orange font-semibold'
                    : 'text-charcoal/60 group-hover:text-charcoal',
                ]"
              >
                View &rarr;
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </SurfaceCard>
</template>
