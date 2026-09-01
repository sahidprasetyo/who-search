<script setup lang="ts">
import { computed } from 'vue'
import PillButton from '@/components/PillButton.vue'
import SurfaceCard from '@/components/SurfaceCard.vue'
import { stripHtmlTags } from '@/services/wikipediaApi'
import { useNavigationStore } from '@/stores/useNavigationStore'
import { useSearchStore } from '@/stores/useSearchStore'
import type { WikiSearchResult } from '@/types/wikipedia'

interface Props {
  results?: WikiSearchResult[]
  selectedResult?: WikiSearchResult | null
  isLoading?: boolean
  error?: string | null
  personName?: string
  personTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  results: undefined,
  selectedResult: undefined,
  isLoading: undefined,
  error: undefined,
  personName: undefined,
  personTitle: undefined,
})

const emit = defineEmits<{
  selectResult: [result: WikiSearchResult]
  retry: []
}>()

const searchStore = useSearchStore()
const navStore = useNavigationStore()

const activeResults = computed(() => props.results ?? searchStore.results)
const activeSelectedResult = computed(
  () => (props.selectedResult !== undefined ? props.selectedResult : searchStore.selectedResult),
)
const loading = computed(() => props.isLoading ?? searchStore.isLoading)
const errorMessage = computed(() => props.error ?? searchStore.error)
const currentPersonName = computed(
  () => props.personName ?? navStore.selectedPerson?.name ?? 'Famous Personality',
)
const currentPersonTitle = computed(
  () => props.personTitle ?? navStore.selectedPerson?.title ?? '',
)

function handleSelect(result: WikiSearchResult): void {
  emit('selectResult', result)
  if (props.selectedResult === undefined) {
    searchStore.selectResult(result)
  }
}

function handleRetry(): void {
  emit('retry')
  if (props.error === undefined && navStore.selectedPerson) {
    void searchStore.fetchResultsForPerson(navStore.selectedPerson.wikiSearchQuery)
  }
}
</script>

<template>
  <SurfaceCard variant="canvas" padding="none">
    <!-- Card Header -->
    <template #header>
      <div class="px-5 pt-3 pb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-marker-orange" aria-hidden="true" />
            <h2 class="text-subheading font-semibold text-cocoa-ink">
              {{ currentPersonName }}
            </h2>
          </div>
          <p v-if="currentPersonTitle" class="text-caption text-charcoal/60 mt-0.5">
            {{ currentPersonTitle }}
          </p>
        </div>

        <span
          v-if="!loading && activeResults.length > 0"
          class="inline-flex items-center self-start sm:self-auto rounded-[20px] bg-dew-drop border border-charcoal/20 px-3 py-1 text-caption text-charcoal/80 font-medium"
        >
          {{ activeResults.length }} Articles Found
        </span>
      </div>
    </template>

    <!-- Loading Skeleton State -->
    <div v-if="loading" class="p-5 flex flex-col gap-3" aria-busy="true" aria-live="polite">
      <div class="flex items-center gap-3 text-caption text-charcoal/60 mb-2">
        <span class="inline-block w-4 h-4 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
        Searching Wikipedia...
      </div>
      <div
        v-for="index in 4"
        :key="index"
        class="h-16 rounded-[8px] bg-dew-drop/60 animate-pulse border border-charcoal/5"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="errorMessage"
      class="p-6 text-center flex flex-col items-center justify-center gap-3"
      role="alert"
    >
      <p class="text-body-sm font-medium text-burnt-sienna">
        {{ errorMessage }}
      </p>
      <PillButton type="button" @click="handleRetry">
        Try Again
      </PillButton>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="activeResults.length === 0"
      class="p-8 text-center text-charcoal/60"
    >
      <p class="text-body-sm">
        No articles found on Wikipedia for this person.
      </p>
    </div>

    <!-- Results Table / List -->
    <div v-else class="overflow-x-auto max-h-[320px] overflow-y-auto">
      <table class="w-full text-left text-body-sm border-collapse">
        <thead class="sticky top-0 bg-dew-drop/90 backdrop-blur z-10 border-b border-charcoal/15 text-caption uppercase text-charcoal/70">
          <tr>
            <th scope="col" class="py-2.5 px-4 w-12 text-center font-medium">No.</th>
            <th scope="col" class="py-2.5 px-4 font-medium">Article Title</th>
            <th scope="col" class="py-2.5 px-4 hidden md:table-cell font-medium">Snippet</th>
            <th scope="col" class="py-2.5 px-4 w-28 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-charcoal/10">
          <tr
            v-for="(result, index) in activeResults"
            :key="result.pageid"
            class="group cursor-pointer transition-colors"
            :class="[
              activeSelectedResult?.pageid === result.pageid
                ? 'bg-dew-drop font-medium border-l-4 border-l-marker-orange'
                : 'hover:bg-dew-drop/40 border-l-4 border-l-transparent',
            ]"
            @click="handleSelect(result)"
          >
            <!-- Index -->
            <td class="py-3 px-4 text-center text-caption text-charcoal/70">
              {{ index + 1 }}
            </td>

            <!-- Title -->
            <td class="py-3 px-4 font-medium text-cocoa-ink">
              <div class="line-clamp-1">
                {{ result.title }}
              </div>
            </td>

            <!-- Snippet Preview -->
            <td class="py-3 px-4 hidden md:table-cell text-caption text-charcoal/70">
              <div class="line-clamp-1">
                {{ stripHtmlTags(result.snippet) }}
              </div>
            </td>

            <!-- Action -->
            <td class="py-3 px-4 text-right">
              <span
                class="inline-flex items-center text-caption transition-colors"
                :class="[
                  activeSelectedResult?.pageid === result.pageid
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
