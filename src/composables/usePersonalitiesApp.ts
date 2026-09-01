import { onMounted, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useNavigationStore } from '@/stores/useNavigationStore'
import { useSearchStore } from '@/stores/useSearchStore'

/**
 * High-level orchestration composable coordinating navigation, search, and theme initialization.
 */
export function usePersonalitiesApp(): {
  navStore: ReturnType<typeof useNavigationStore>
  searchStore: ReturnType<typeof useSearchStore>
  theme: ReturnType<typeof useTheme>
} {
  const navStore = useNavigationStore()
  const searchStore = useSearchStore()
  const theme = useTheme()

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
    theme.initTheme()

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
    theme,
  }
}
