import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import * as wikipediaApi from '@/services/wikipediaApi'
import { useSearchStore } from '@/stores/useSearchStore'
import type { WikiSearchResult } from '@/types/wikipedia'

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

  it('fetches search results and selects first article by default', async () => {
    const mockResults: WikiSearchResult[] = [
      {
        pageid: 1,
        title: 'Albert Einstein',
        snippet: 'A renowned physicist.',
        timestamp: '2026-01-01',
        wordcount: 1000,
      },
      {
        pageid: 2,
        title: 'Einstein field equations',
        snippet: 'General relativity equations.',
        timestamp: '2026-01-01',
        wordcount: 800,
      },
    ]

    vi.spyOn(wikipediaApi, 'searchWikipedia').mockResolvedValue(mockResults)

    const store = useSearchStore()
    await store.fetchResultsForPerson('Albert Einstein')

    expect(store.isLoading).toBe(false)
    expect(store.results).toHaveLength(2)
    expect(store.selectedResult?.pageid).toBe(1)
    expect(store.hasResults).toBe(true)
    expect(store.selectedArticleUrl).toBe('https://en.wikipedia.org/wiki/Albert_Einstein')
  })

  it('handles error during search', async () => {
    vi.spyOn(wikipediaApi, 'searchWikipedia').mockRejectedValue(
      new Error('Network connection failed'),
    )

    const store = useSearchStore()
    await store.fetchResultsForPerson('Fail Query')

    expect(store.isLoading).toBe(false)
    expect(store.results).toEqual([])
    expect(store.selectedResult).toBeNull()
    expect(store.error).toBe('Network connection failed')
  })

  it('allows manual selection of a specific result', () => {
    const store = useSearchStore()
    const result: WikiSearchResult = {
      pageid: 42,
      title: 'Theory of Relativity',
      snippet: 'Physics theory.',
      timestamp: '2026-01-01',
      wordcount: 500,
    }

    store.selectResult(result)
    expect(store.selectedResult?.title).toBe('Theory of Relativity')
    expect(store.selectedArticleUrl).toBe('https://en.wikipedia.org/wiki/Theory_of_Relativity')
  })

  it('clears search state properly', () => {
    const store = useSearchStore()
    store.results = [
      {
        pageid: 1,
        title: 'Test',
        snippet: 'Test',
        timestamp: '2026',
        wordcount: 10,
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
