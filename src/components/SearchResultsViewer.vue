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
    <!-- Card Header: mint block marks the results card -->
    <template #header>
      <div
        class="bg-mint-block px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-6"
      >
        <div class="min-w-0">
          <h2 class="text-subheading sm:text-heading-sm font-black text-charcoal truncate">
            {{ currentPersonName }}
          </h2>
          <p v-if="currentPersonTitle" class="text-caption text-charcoal/75 mt-1 truncate">
            {{ currentPersonTitle }}
          </p>
        </div>

        <p
          v-if="!loading && activeResults.length > 0"
          class="shrink-0 text-caption text-charcoal/75 font-medium tabular-nums"
        >
          {{ activeResults.length }} {{ activeResults.length === 1 ? 'result' : 'results' }}
        </p>
      </div>
    </template>

    <!-- Loading Skeleton State -->
    <SearchResultsSkeleton v-if="loading" />

    <!-- Error State -->
    <div
      v-else-if="errorMessage"
      class="p-8 text-center flex flex-col items-center justify-center gap-6"
      role="alert"
    >
      <p class="max-w-md text-body-sm leading-relaxed font-medium text-burnt-sienna">
        {{ errorMessage }}
      </p>
      <PillButton type="button" @click="handleRetry"> Try Again </PillButton>
    </div>

    <!-- Empty State -->
    <div v-else-if="activeResults.length === 0" class="p-10 text-center text-charcoal/70">
      <p class="text-body-sm leading-relaxed">No search results found for this person.</p>
    </div>

    <!-- Results List: flat rows, hierarchy comes from type weight and tone -->
    <ol
      v-else
      class="max-h-[440px] sm:max-h-[480px] overflow-y-auto overscroll-contain list-none m-0 p-4 sm:p-6 flex flex-col gap-4"
    >
      <li v-for="(result, index) in activeResults" :key="result.link || index">
        <button
          type="button"
          class="group w-full flex gap-4 p-4 rounded-inputs text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marker-orange"
          :class="isResultSelected(result) ? 'bg-dew-drop' : 'hover:bg-charcoal/5'"
          :aria-current="isResultSelected(result) ? 'true' : undefined"
          @click="handleSelect(result)"
        >
          <span class="w-6 shrink-0 pt-0.5 text-caption text-charcoal/50 font-medium tabular-nums">
            {{ result.position ?? index + 1 }}
          </span>

          <span class="flex-1 min-w-0 flex flex-col gap-1.5">
            <span class="flex items-center gap-2 min-w-0">
              <img
                v-if="result.favicon"
                :src="result.favicon"
                alt=""
                class="w-4 h-4 rounded-sm object-contain shrink-0"
                loading="lazy"
                @error="($event.target as HTMLElement).style.display = 'none'"
              />
              <span class="text-sm text-charcoal/65 truncate">
                {{ result.source || result.displayed_link || formatDomain(result.link) }}
              </span>
            </span>

            <span
              class="text-body-sm font-semibold leading-snug text-charcoal line-clamp-2 decoration-marker-orange decoration-2 underline-offset-4 group-hover:underline"
            >
              {{ result.title }}
            </span>

            <span
              v-if="result.snippet"
              class="max-w-[68ch] text-caption leading-relaxed text-charcoal/75 line-clamp-2"
            >
              {{ stripHtmlTags(result.snippet) }}
            </span>
          </span>
        </button>
      </li>
    </ol>
  </SurfaceCard>
</template>
