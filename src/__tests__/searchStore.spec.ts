import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import * as duckduckgoApi from '@/services/duckduckgoApi'
import { useSearchStore } from '@/stores/useSearchStore'
import type { SearchResultItem } from '@/types/search'

describe('useSearchStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with empty state', () => {
    const store = useSearchStore()
    expect(store.results).toEqual([])
    expect(store.selectedResult).toBeNull()
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.hasResults).toBe(false)
    expect(store.selectedArticleUrl).toBeNull()
  })

  it('fetches DuckDuckGo search results and selects first item by default', async () => {
    const mockResults: SearchResultItem[] = [
      {
        position: 1,
        title: 'Albert Einstein - Wikipedia',
        link: 'https://en.wikipedia.org/wiki/Albert_Einstein',
        snippet: 'A renowned theoretical physicist.',
        source: 'Wikipedia',
        favicon: 'https://en.wikipedia.org/favicon.ico',
      },
      {
        position: 2,
        title: 'Albert Einstein | Biography - Britannica',
        link: 'https://www.britannica.com/biography/Albert-Einstein',
        snippet: 'General relativity and Nobel prize winner.',
        source: 'Britannica',
      },
    ]

    vi.spyOn(duckduckgoApi, 'searchDuckDuckGo').mockResolvedValue(mockResults)

    const store = useSearchStore()
    await store.fetchResultsForPerson('Albert Einstein')

    expect(store.isLoading).toBe(false)
    expect(store.results).toHaveLength(2)
    expect(store.selectedResult?.title).toBe('Albert Einstein - Wikipedia')
    expect(store.hasResults).toBe(true)
    expect(store.selectedArticleUrl).toBe('https://en.wikipedia.org/wiki/Albert_Einstein')
  })

  it('handles error during DuckDuckGo search', async () => {
    vi.spyOn(duckduckgoApi, 'searchDuckDuckGo').mockRejectedValue(
      new Error('SearchApi.io network connection failed'),
    )

    const store = useSearchStore()
    await store.fetchResultsForPerson('Fail Query')

    expect(store.isLoading).toBe(false)
    expect(store.results).toEqual([])
    expect(store.selectedResult).toBeNull()
    expect(store.error).toBe('SearchApi.io network connection failed')
  })

  it('allows manual selection of a specific DuckDuckGo result', () => {
    const store = useSearchStore()
    const result: SearchResultItem = {
      position: 42,
      title: 'Theory of Relativity - Britannica',
      link: 'https://www.britannica.com/science/theory-of-relativity',
      snippet: 'Physics theory formulation.',
    }

    store.selectResult(result)
    expect(store.selectedResult?.title).toBe('Theory of Relativity - Britannica')
    expect(store.selectedArticleUrl).toBe('https://www.britannica.com/science/theory-of-relativity')
  })

  it('clears search state properly', () => {
    const store = useSearchStore()
    store.results = [
      {
        position: 1,
        title: 'Test',
        link: 'https://example.com',
        snippet: 'Test snippet',
      },
    ]
    store.selectedResult = store.results[0] ?? null
    store.error = 'Some error'

    store.clearSearch()
    expect(store.results).toEqual([])
    expect(store.selectedResult).toBeNull()
    expect(store.error).toBeNull()
  })
})
