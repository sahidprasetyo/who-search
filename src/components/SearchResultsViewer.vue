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
    const query = selectedPerson.value.searchQuery || selectedPerson.value.name
    void searchStore.fetchResultsForPerson(query)
  }
}
</script>

<template>
  <SurfaceCard variant="canvas" padding="none">
    <!-- Card Header -->
    <template #header>
      <div
        class="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-cream-paper dark:bg-surface-card"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span
              class="inline-block w-3 h-3 rounded-sm bg-marker-orange border border-charcoal shadow-[1px_1px_0px_0px_var(--color-charcoal)] shrink-0"
              aria-hidden="true"
            />
            <h2 class="text-body sm:text-subheading font-black text-charcoal truncate">
              {{ currentPersonName }}
            </h2>
          </div>
          <p v-if="currentPersonTitle" class="text-caption font-medium text-charcoal/80 mt-0.5 truncate">
            {{ currentPersonTitle }}
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span
            v-if="!loading && activeResults.length > 0"
            class="inline-flex items-center self-start sm:self-auto rounded-tags bg-dew-drop border-2 border-charcoal px-3 py-1 text-caption text-charcoal font-bold shadow-subtle"
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
      <p class="text-body-sm font-bold text-burnt-sienna border-2 border-burnt-sienna bg-burnt-sienna/10 p-3 rounded-inputs">
        {{ errorMessage }}
      </p>
      <PillButton type="button" @click="handleRetry"> Try Again </PillButton>
    </div>

    <!-- Empty State -->
    <div v-else-if="activeResults.length === 0" class="p-8 text-center text-charcoal/70">
      <p class="text-body-sm font-medium">No search results found for this person.</p>
    </div>

    <!-- Results Table / List (Single-axis scroll with overscroll-contain) -->
    <div v-else class="max-h-[340px] sm:max-h-[380px] overflow-y-auto overscroll-contain">
      <table class="w-full text-left text-body-sm border-collapse">
        <thead
          class="sticky top-0 bg-dew-drop z-10 border-b-2 border-charcoal text-caption uppercase text-charcoal font-black tracking-wider"
        >
          <tr>
            <th scope="col" class="py-2.5 px-3 sm:px-4 w-10 sm:w-12 text-center font-black">
              No.
            </th>
            <th scope="col" class="py-2.5 px-3 sm:px-4 font-black">
              Search Result
            </th>
            <th scope="col" class="py-2.5 px-4 hidden md:table-cell font-black">
              Snippet
            </th>
            <th scope="col" class="py-2.5 px-3 sm:px-4 w-20 sm:w-28 text-right font-black">
              Preview
            </th>
          </tr>
        </thead>
        <tbody class="divide-y-2 divide-charcoal/15">
          <tr
            v-for="(result, index) in activeResults"
            :key="result.link || index"
            class="group cursor-pointer transition-colors"
            :class="[
              isResultSelected(result)
                ? 'bg-dew-drop font-semibold border-l-4 border-l-marker-orange'
                : 'hover:bg-dew-drop/30 border-l-4 border-l-transparent',
            ]"
            @click="handleSelect(result)"
          >
            <!-- Index -->
            <td class="py-3.5 sm:py-3 px-3 sm:px-4 text-center text-caption text-charcoal font-bold align-top">
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
                    class="w-3.5 h-3.5 rounded-sm object-contain shrink-0 border border-charcoal/40"
                    loading="lazy"
                    @error="($event.target as HTMLElement).style.display = 'none'"
                  />
                  <span class="text-xs text-charcoal/80 font-mono font-medium truncate">
                    {{ result.source || result.displayed_link || formatDomain(result.link) }}
                  </span>
                </div>

                <!-- Title -->
                <div
                  class="font-bold text-charcoal line-clamp-1 group-hover:text-marker-orange group-hover:underline transition-colors"
                >
                  {{ result.title }}
                </div>
              </div>
            </td>

            <!-- Snippet Preview -->
            <td class="py-3.5 sm:py-3 px-4 hidden md:table-cell text-caption text-charcoal/80 align-top">
              <div class="line-clamp-2 font-normal">
                {{ stripHtmlTags(result.snippet) }}
              </div>
            </td>

            <!-- Action -->
            <td class="py-3.5 sm:py-3 px-3 sm:px-4 text-right align-top">
              <span
                class="inline-flex items-center text-caption font-bold transition-all"
                :class="[
                  isResultSelected(result)
                    ? 'text-marker-orange translate-x-0.5'
                    : 'text-charcoal group-hover:text-marker-orange',
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
