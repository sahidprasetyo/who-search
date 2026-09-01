import type { SearchApiResponse, SearchResultItem } from '@/types'
import { buildUrlWithParams, formatDomain } from '@/utils/url-helpers'
import { stripHtmlTags } from '@/utils/formatters'

// Re-export pure helpers for convenience and backward compatibility
export { formatDomain, stripHtmlTags }

const SEARCHAPI_ENDPOINT = 'https://www.searchapi.io/api/v1/search'

/**
 * Retrieves the SearchApi.io API key from environment configuration if available.
 */
export function getSearchApiKey(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SEARCHAPI_KEY) {
    return import.meta.env.VITE_SEARCHAPI_KEY
  }
  return ''
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
 * Executes a DuckDuckGo web search via SearchApi.io with query parameters and optional abort signal.
 */
export async function searchDuckDuckGo(
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
  if (!resolvedApiKey || resolvedApiKey === 'your_searchapi_key_here') {
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
          'Invalid or unauthorized SearchApi.io key. Please check your VITE_SEARCHAPI_KEY in .env.',
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
    throw err instanceof Error ? err : new Error('Failed to retrieve DuckDuckGo search results')
  }
}
