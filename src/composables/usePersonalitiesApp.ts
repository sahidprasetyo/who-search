import { onMounted, watch } from 'vue'
import { useNavigationStore } from '@/stores/useNavigationStore'
import { useSearchStore } from '@/stores/useSearchStore'

/**
 * High-level orchestration composable coordinating navigation and search stores.
 */
export function usePersonalitiesApp(): {
  navStore: ReturnType<typeof useNavigationStore>
  searchStore: ReturnType<typeof useSearchStore>
} {
  const navStore = useNavigationStore()
  const searchStore = useSearchStore()

  // Reactively fetch search results when the selected person changes
  watch(
    () => navStore.selectedPerson,
    (newPerson) => {
      if (newPerson) {
        void searchStore.fetchResultsForPerson(newPerson.wikiSearchQuery)
      } else {
        searchStore.clearSearch()
      }
    },
    { immediate: false },
  )

  onMounted(() => {
    // Initial fetch for the default selected person
    if (navStore.selectedPerson && searchStore.results.length === 0) {
      void searchStore.fetchResultsForPerson(navStore.selectedPerson.wikiSearchQuery)
    }
  })

  return {
    navStore,
    searchStore,
  }
}
