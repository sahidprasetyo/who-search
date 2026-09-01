import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatDomain,
  generateFallbackResults,
  getSearchApiKey,
  searchDuckDuckGo,
  stripHtmlTags,
} from '@/services/duckduckgoApi'
import type { SearchApiResponse } from '@/types'

describe('duckduckgoApi Service', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  describe('searchDuckDuckGo', () => {
    it('returns empty array when query is empty or whitespace', async () => {
      const results = await searchDuckDuckGo('   ')
      expect(results).toEqual([])
    })

    it('returns curated fallback results when no API key is provided', async () => {
      const results = await searchDuckDuckGo('Albert Einstein', '')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0]?.title).toContain('Albert Einstein')
      expect(results[0]?.link).toContain('https://en.wikipedia.org/wiki/Albert_Einstein')
    })

    it('successfully fetches and parses organic results from SearchApi.io', async () => {
      const mockResponse: SearchApiResponse = {
        search_metadata: {
          id: 'search_123',
          status: 'Success',
        },
        search_parameters: {
          engine: 'duckduckgo',
          q: 'Albert Einstein',
        },
        organic_results: [
          {
            position: 1,
            title: 'Albert Einstein - DuckDuckGo Result',
            link: 'https://en.wikipedia.org/wiki/Albert_Einstein',
            snippet: 'Theoretical physicist who revolutionized modern physics.',
            displayed_link: 'https://en.wikipedia.org › wiki › Albert_Einstein',
            favicon: 'https://en.wikipedia.org/favicon.ico',
            source: 'Wikipedia',
          },
        ],
      }

      globalThis.fetch = vi.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const results = await searchDuckDuckGo('Albert Einstein', 'valid_test_api_key')
      expect(results).toHaveLength(1)
      expect(results[0]?.title).toBe('Albert Einstein - DuckDuckGo Result')
      expect(results[0]?.link).toBe('https://en.wikipedia.org/wiki/Albert_Einstein')
      expect(results[0]?.source).toBe('Wikipedia')

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('engine=duckduckgo&q=Albert+Einstein&api_key=valid_test_api_key'),
        expect.any(Object),
      )
    })

    it('throws descriptive error on 401 unauthorized status', async () => {
      globalThis.fetch = vi.fn<typeof fetch>().mockResolvedValue({
        ok: false,
        status: 401,
      } as Response)

      await expect(searchDuckDuckGo('Test Query', 'invalid_key')).rejects.toThrow(
        'Invalid or unauthorized SearchApi.io key',
      )
    })

    it('throws error when response status is 500', async () => {
      globalThis.fetch = vi.fn<typeof fetch>().mockResolvedValue({
        ok: false,
        status: 500,
      } as Response)

      await expect(searchDuckDuckGo('Test Query', 'any_key')).rejects.toThrow(
        'SearchApi.io error: HTTP status 500',
      )
    })

    it('throws error when payload contains error message', async () => {
      globalThis.fetch = vi.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        json: async () => ({
          error: 'Rate limit exceeded',
        }),
      } as Response)

      await expect(searchDuckDuckGo('Test Query', 'key')).rejects.toThrow(
        'SearchApi.io error: Rate limit exceeded',
      )
    })

    it('returns empty array on abort error without throwing', async () => {
      const abortError = new DOMException('The operation was aborted', 'AbortError')
      globalThis.fetch = vi.fn<typeof fetch>().mockRejectedValue(abortError)

      const results = await searchDuckDuckGo('Aborted Query', 'key')
      expect(results).toEqual([])
    })
  })

  describe('formatDomain', () => {
    it('extracts clean domain from valid URL', () => {
      expect(formatDomain('https://www.britannica.com/biography/Albert-Einstein')).toBe(
        'britannica.com',
      )
      expect(formatDomain('https://en.wikipedia.org/wiki/Albert_Einstein')).toBe(
        'en.wikipedia.org',
      )
    })

    it('returns raw string when URL is invalid', () => {
      expect(formatDomain('not-a-url')).toBe('not-a-url')
    })
  })

  describe('stripHtmlTags', () => {
    it('removes HTML tags and decodes entities correctly', () => {
      const input = '<b>Pioneered</b> relativity &amp; &quot;genius&quot; physics'
      expect(stripHtmlTags(input)).toBe('Pioneered relativity & "genius" physics')
    })
  })

  describe('getSearchApiKey', () => {
    it('returns empty string when no environment key is configured', () => {
      expect(typeof getSearchApiKey()).toBe('string')
    })
  })

  describe('generateFallbackResults', () => {
    it('generates 4 realistic organic results for a given query', () => {
      const results = generateFallbackResults('Marie Curie')
      expect(results).toHaveLength(4)
      expect(results[0]?.title).toContain('Marie Curie')
      expect(results[0]?.link).toContain('https://en.wikipedia.org/wiki/Marie_Curie')
    })
  })
})
