import { ref, type Ref } from 'vue'
import { searchWikipedia } from '@/services/wikipediaApi'
import type { WikiSearchResult } from '@/types/wikipedia'

export interface UseWikipediaSearchReturn {
  results: Ref<WikiSearchResult[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  search: (query: string) => Promise<WikiSearchResult[]>
  cancel: () => void
}

/**
 * Composable for managing Wikipedia search API lifecycle with abort capability.
 */
export function useWikipediaSearch(): UseWikipediaSearchReturn {
  const results = ref<WikiSearchResult[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  let abortController: AbortController | null = null

  function cancel(): void {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  async function search(query: string): Promise<WikiSearchResult[]> {
    cancel()

    if (!query.trim()) {
      results.value = []
      isLoading.value = false
      error.value = null
      return []
    }

    abortController = new AbortController()
    isLoading.value = true
    error.value = null

    try {
      const data = await searchWikipedia(query, 10, abortController.signal)
      results.value = data
      return data
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return results.value
      }
      const message = err instanceof Error ? err.message : 'Unknown error occurred while searching'
      error.value = message
      results.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    results,
    isLoading,
    error,
    search,
    cancel,
  }
}
