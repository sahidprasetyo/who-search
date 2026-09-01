import { ref, type Ref } from 'vue'
import { searchDuckDuckGo } from '@/services/duckduckgoApi'
import type { SearchResultItem } from '@/types/search'

export interface UseDuckDuckGoSearchReturn {
  results: Ref<SearchResultItem[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  search: (query: string) => Promise<SearchResultItem[]>
  cancel: () => void
}

/**
 * Composable for managing DuckDuckGo search requests via SearchApi.io with abort capability.
 */
export function useDuckDuckGoSearch(): UseDuckDuckGoSearchReturn {
  const results = ref<SearchResultItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  let abortController: AbortController | null = null

  function cancel(): void {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  async function search(query: string): Promise<SearchResultItem[]> {
    cancel()

    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      results.value = []
      isLoading.value = false
      error.value = null
      return []
    }

    abortController = new AbortController()
    isLoading.value = true
    error.value = null

    try {
      const data = await searchDuckDuckGo(trimmedQuery, undefined, abortController.signal)
      results.value = data
      return data
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return results.value
      }
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred while searching DuckDuckGo'
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

/**
 * Generic alias for web search composable.
 */
export const useWebSearch = useDuckDuckGoSearch
