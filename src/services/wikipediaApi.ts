import type { WikiSearchResponse, WikiSearchResult } from '@/types/wikipedia'

const WIKIPEDIA_API_BASE = 'https://en.wikipedia.org/w/api.php'
const WIKIPEDIA_ARTICLE_BASE = 'https://en.wikipedia.org/wiki'

/**
 * Searches Wikipedia MediaWiki Action API for articles related to the query string.
 * Uses native CORS via `origin=*`.
 */
export async function searchWikipedia(
  query: string,
  limit = 10,
  signal?: AbortSignal,
): Promise<WikiSearchResult[]> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return []
  }

  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: trimmedQuery,
    utf8: '',
    format: 'json',
    origin: '*',
    srlimit: limit.toString(),
  })

  const url = `${WIKIPEDIA_API_BASE}?${params.toString()}`

  try {
    const response = await fetch(url, { signal })

    if (!response.ok) {
      throw new Error(`Wikipedia API error: HTTP status ${response.status}`)
    }

    const data = (await response.json()) as WikiSearchResponse

    if (data.error) {
      throw new Error(`Wikipedia API error: ${data.error.info}`)
    }

    return data.query?.search ?? []
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return []
    }
    throw err instanceof Error ? err : new Error('Failed to fetch from Wikipedia API')
  }
}

/**
 * Generates the full Wikipedia web URL for an article title.
 */
export function getWikipediaArticleUrl(title: string): string {
  return `${WIKIPEDIA_ARTICLE_BASE}/${encodeURIComponent(title.replace(/ /g, '_'))}`
}

/**
 * Helper to strip HTML tags from Wikipedia snippets safely.
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>?/gm, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
}
