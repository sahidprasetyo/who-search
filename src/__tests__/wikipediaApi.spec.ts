import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getWikipediaArticleUrl,
  searchWikipedia,
  stripHtmlTags,
} from '@/services/wikipediaApi'
import type { WikiSearchResponse } from '@/types/wikipedia'

describe('wikipediaApi', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  describe('searchWikipedia', () => {
    it('returns empty array when query is empty or whitespace', async () => {
      const results = await searchWikipedia('   ')
      expect(results).toEqual([])
    })

    it('successfully fetches and parses Wikipedia search results', async () => {
      const mockResponse: WikiSearchResponse = {
        query: {
          search: [
            {
              pageid: 1234,
              title: 'Albert Einstein',
              snippet: 'Physicist who developed the <span class="searchmatch">theory</span> of relativity.',
              timestamp: '2026-01-01T00:00:00Z',
              wordcount: 5000,
            },
          ],
        },
      }

      globalThis.fetch = vi.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const results = await searchWikipedia('Albert Einstein', 5)
      expect(results).toHaveLength(1)
      expect(results[0]?.title).toBe('Albert Einstein')
      expect(results[0]?.pageid).toBe(1234)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('srsearch=Albert+Einstein'),
        expect.any(Object),
      )
    })

    it('throws error when response is not ok', async () => {
      globalThis.fetch = vi.fn<typeof fetch>().mockResolvedValue({
        ok: false,
        status: 500,
      } as Response)

      await expect(searchWikipedia('Test Query')).rejects.toThrow(
        'Wikipedia API error: HTTP status 500',
      )
    })

    it('throws error when API returns an error field', async () => {
      globalThis.fetch = vi.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        json: async () => ({
          error: {
            code: 'badquery',
            info: 'The search query was invalid',
          },
        }),
      } as Response)

      await expect(searchWikipedia('Bad query')).rejects.toThrow(
        'Wikipedia API error: The search query was invalid',
      )
    })

    it('returns empty array on abort error without throwing', async () => {
      const abortError = new DOMException('The operation was aborted', 'AbortError')
      globalThis.fetch = vi.fn<typeof fetch>().mockRejectedValue(abortError)

      const results = await searchWikipedia('Aborted Query')
      expect(results).toEqual([])
    })
  })

  describe('getWikipediaArticleUrl', () => {
    it('generates correct Wikipedia article URL', () => {
      const url = getWikipediaArticleUrl('Albert Einstein')
      expect(url).toBe('https://en.wikipedia.org/wiki/Albert_Einstein')
    })

    it('properly encodes special characters in article title', () => {
      const url = getWikipediaArticleUrl('C++ (Programming Language)')
      expect(url).toBe('https://en.wikipedia.org/wiki/C%2B%2B_(Programming_Language)')
    })
  })

  describe('stripHtmlTags', () => {
    it('removes HTML tags and decodes common HTML entities', () => {
      const input = 'Famous for <span class="searchmatch">relativity</span> &amp; &quot;genius&quot;'
      const output = stripHtmlTags(input)
      expect(output).toBe('Famous for relativity & "genius"')
    })
  })
})
