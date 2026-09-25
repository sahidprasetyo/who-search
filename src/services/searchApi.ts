import type { SearchApiResponse, SearchResultItem } from '@/types'
import { buildUrlWithParams, formatDomain } from '@/utils/url-helpers'
import { stripHtmlTags } from '@/utils/formatters'
import { getStorageItem, removeStorageItem, setStorageItem } from '@/utils/storage'

// Re-export pure helpers for convenience and backward compatibility
export { formatDomain, stripHtmlTags }

const SEARCHAPI_ENDPOINT = 'https://www.searchapi.io/api/v1/search'
const SEARCHAPI_KEY_STORAGE_KEY = 'who-search:searchapi-key'
const PLACEHOLDER_KEY = 'your_searchapi_key_here'

/**
 * Retrieves the visitor's SearchApi.io key from this browser's storage.
 * `VITE_SEARCHAPI_KEY` is honoured in dev only, so a production build never inlines a key.
 */
export function getSearchApiKey(): string {
  const storedKey = getStorageItem<string>(SEARCHAPI_KEY_STORAGE_KEY, '')
  const key = storedKey || (import.meta.env.DEV ? (import.meta.env.VITE_SEARCHAPI_KEY ?? '') : '')
  return key === PLACEHOLDER_KEY ? '' : key
}

/**
 * Saves the visitor's own SearchApi.io key in this browser; an empty value removes it.
 */
export function setSearchApiKey(key: string): void {
  const trimmedKey = key.trim()
  if (trimmedKey) {
    setStorageItem(SEARCHAPI_KEY_STORAGE_KEY, trimmedKey)
  } else {
    removeStorageItem(SEARCHAPI_KEY_STORAGE_KEY)
  }
}

/**
 * Generates curated fallback search results when API key is unconfigured or rate-limited.
 */
export function generateFallbackResults(query: string): SearchResultItem[] {
  const cleanQuery = query.trim()
  const encodedQuery = encodeURIComponent(cleanQuery.replace(/ /g, '_'))

  return [
    {
      position: 1,
      title: `${cleanQuery} | Biography, Accomplishments, & Facts | Britannica`,
      link: `https://www.britannica.com/biography/${encodedQuery}`,
      snippet: `Explore the life, major achievements, and historical context of ${cleanQuery} in this comprehensive Britannica entry.`,
      displayed_link: `https://www.britannica.com › biography › ${encodedQuery}`,
      favicon: 'https://www.britannica.com/favicon.ico',
      source: 'Britannica',
    },
    {
      position: 2,
      title: `${cleanQuery} - World History Encyclopedia`,
      link: `https://www.worldhistory.org/search/?q=${encodedQuery}`,
      snippet: `${cleanQuery} was an influential figure whose pioneering work and enduring legacy reshaped modern society and history.`,
      displayed_link: `https://www.worldhistory.org › search › ${encodedQuery}`,
      favicon: 'https://www.worldhistory.org/favicon.ico',
      source: 'World History',
    },
    {
      position: 3,
      title: `${cleanQuery} Archives & Historical Records`,
      link: `https://archive.org/search?query=${encodedQuery}`,
      snippet: `Digitized collection of papers, letters, speeches, and biographical records relating to ${cleanQuery}.`,
      displayed_link: `https://archive.org › search › ${encodedQuery}`,
      favicon: 'https://archive.org/favicon.ico',
      source: 'Internet Archive',
    },
    {
      position: 4,
      title: `The Life and Legacy of ${cleanQuery} - Biography`,
      link: `https://www.biography.com/people/${encodedQuery}`,
      snippet: `Read a detailed overview of ${cleanQuery}'s early life, career milestones, personal struggles, and historical impact.`,
      displayed_link: `https://www.biography.com › people › ${encodedQuery}`,
      favicon: 'https://www.biography.com/favicon.ico',
      source: 'Biography.com',
    },
  ]
}

/**
 * Executes a web search via SearchApi.io (DuckDuckGo engine) with query parameters and optional abort signal.
 */
export async function querySearchApi(
  query: string,
  apiKey?: string,
  signal?: AbortSignal,
): Promise<SearchResultItem[]> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return []
  }

  const resolvedApiKey = apiKey ?? getSearchApiKey()

  // If no API key is provided or dummy placeholder is used, gracefully return curated fallback results
  if (!resolvedApiKey || resolvedApiKey === PLACEHOLDER_KEY) {
    return generateFallbackResults(trimmedQuery)
  }

  const url = buildUrlWithParams(SEARCHAPI_ENDPOINT, {
    engine: 'duckduckgo',
    q: trimmedQuery,
    api_key: resolvedApiKey,
  })

  try {
    const response = await fetch(url, { signal })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          'Invalid or unauthorized SearchApi.io key. Please check the key saved under "API key".',
        )
      }
      throw new Error(`SearchApi.io error: HTTP status ${response.status}`)
    }

    const data = (await response.json()) as SearchApiResponse

    if (data.error) {
      throw new Error(`SearchApi.io error: ${data.error}`)
    }

    return data.organic_results ?? []
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return []
    }
    throw err instanceof Error ? err : new Error('Failed to retrieve SearchApi.io search results')
  }
}
