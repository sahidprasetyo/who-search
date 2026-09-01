import { defineStore } from 'pinia'
import { searchDuckDuckGo } from '@/services/duckduckgoApi'
import type { SearchResultItem } from '@/types/search'

interface SearchState {
  results: SearchResultItem[]
  selectedResult: SearchResultItem | null
  isLoading: boolean
  error: string | null
  currentSearchQuery: string
  isFallback: boolean
}

let activeAbortController: AbortController | null = null

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    results: [],
    selectedResult: null,
    isLoading: false,
    error: null,
    currentSearchQuery: '',
    isFallback: false,
  }),

  getters: {
    hasResults: (state): boolean => state.results.length > 0,
    selectedArticleUrl: (state): string | null => {
      return state.selectedResult?.link ?? null
    },
  },

  actions: {
    async fetchResultsForPerson(query: string): Promise<void> {
      const trimmedQuery = query.trim()
      if (!trimmedQuery) {
        this.clearSearch()
        return
      }

      // Abort previous in-flight request if any
      if (activeAbortController) {
        activeAbortController.abort()
        activeAbortController = null
      }

      activeAbortController = new AbortController()
      this.isLoading = true
      this.error = null
      this.currentSearchQuery = trimmedQuery

      try {
        const searchResults = await searchDuckDuckGo(
          trimmedQuery,
          undefined,
          activeAbortController.signal,
        )
        this.results = searchResults
        // Default to the first search result if available
        this.selectedResult = searchResults[0] ?? null
        this.isFallback =
          !import.meta.env?.VITE_SEARCHAPI_KEY ||
          import.meta.env.VITE_SEARCHAPI_KEY === 'your_searchapi_key_here'
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        this.error =
          err instanceof Error ? err.message : 'Failed to retrieve DuckDuckGo search results'
        this.results = []
        this.selectedResult = null
      } finally {
        this.isLoading = false
      }
    },

    selectResult(result: SearchResultItem): void {
      this.selectedResult = result
    },

    clearSearch(): void {
      if (activeAbortController) {
        activeAbortController.abort()
        activeAbortController = null
      }
      this.results = []
      this.selectedResult = null
      this.isLoading = false
      this.error = null
      this.currentSearchQuery = ''
      this.isFallback = false
    },
  },
})
