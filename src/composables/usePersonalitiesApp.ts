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
        const query = newPerson.searchQuery ?? newPerson.wikiSearchQuery ?? newPerson.name
        void searchStore.fetchResultsForPerson(query)
      } else {
        searchStore.clearSearch()
      }
    },
    { immediate: false },
  )

  onMounted(() => {
    // Initial fetch for the default selected person
    if (navStore.selectedPerson && searchStore.results.length === 0) {
      const query =
        navStore.selectedPerson.searchQuery ??
        navStore.selectedPerson.wikiSearchQuery ??
        navStore.selectedPerson.name
      void searchStore.fetchResultsForPerson(query)
    }
  })

  return {
    navStore,
    searchStore,
  }
}
