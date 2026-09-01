import { defineStore } from 'pinia'
import { getWikipediaArticleUrl, searchWikipedia } from '@/services/wikipediaApi'
import type { WikiSearchResult } from '@/types/wikipedia'

interface SearchState {
  results: WikiSearchResult[]
  selectedResult: WikiSearchResult | null
  isLoading: boolean
  error: string | null
  currentSearchQuery: string
}

let activeAbortController: AbortController | null = null

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    results: [],
    selectedResult: null,
    isLoading: false,
    error: null,
    currentSearchQuery: '',
  }),

  getters: {
    hasResults: (state): boolean => state.results.length > 0,
    selectedArticleUrl: (state): string | null => {
      if (!state.selectedResult) {
        return null
      }
      return getWikipediaArticleUrl(state.selectedResult.title)
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
        const searchResults = await searchWikipedia(trimmedQuery, 10, activeAbortController.signal)
        this.results = searchResults
        // Default to the first search result if available
        this.selectedResult = searchResults[0] ?? null
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        this.error = err instanceof Error ? err.message : 'Failed to retrieve search results'
        this.results = []
        this.selectedResult = null
      } finally {
        this.isLoading = false
      }
    },

    selectResult(result: WikiSearchResult): void {
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
    },
  },
})
