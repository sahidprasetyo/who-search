import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  stripHtmlTags,
  truncateText,
  formatDomain,
  buildUrlWithParams,
  isValidUrl,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  toggleHtmlClass,
  isSystemDarkMode,
  watchSystemDarkMode,
} from '@/utils'

describe('src/utils', () => {
  describe('formatters', () => {
    it('strips HTML tags and decodes entities', () => {
      expect(stripHtmlTags('<p>Hello <b>World</b> &amp; &quot;Friends&quot;</p>')).toBe(
        'Hello World & "Friends"',
      )
      expect(stripHtmlTags('')).toBe('')
    })

    it('truncates text with ellipsis suffix', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...')
      expect(truncateText('Short', 10)).toBe('Short')
      expect(truncateText('', 5)).toBe('')
    })
  })

  describe('url-helpers', () => {
    it('formats domains by removing www prefix', () => {
      expect(formatDomain('https://www.example.com/path?foo=bar')).toBe('example.com')
      expect(formatDomain('https://sub.domain.org/')).toBe('sub.domain.org')
      expect(formatDomain('not-a-valid-url')).toBe('not-a-valid-url')
      expect(formatDomain('')).toBe('')
    })

    it('builds URL with query parameters', () => {
      const url = buildUrlWithParams('https://api.example.com/search', {
        q: 'Albert Einstein',
        engine: 'duckduckgo',
        empty: '',
        nullVal: undefined,
      })
      expect(url).toBe('https://api.example.com/search?q=Albert+Einstein&engine=duckduckgo')
    })

    it('validates URLs correctly', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(isValidUrl('invalid-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('storage', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('sets, gets, and removes items safely from localStorage', () => {
      expect(getStorageItem('test_key', 'default_val')).toBe('default_val')

      setStorageItem('test_key', 'stored_val')
      expect(getStorageItem('test_key', 'default_val')).toBe('stored_val')

      removeStorageItem('test_key')
      expect(getStorageItem('test_key', 'default_val')).toBe('default_val')
    })
  })

  describe('dom', () => {
    beforeEach(() => {
      document.documentElement.className = ''
      vi.restoreAllMocks()
    })

    afterEach(() => {
      document.documentElement.className = ''
    })

    it('toggles HTML classes safely', () => {
      toggleHtmlClass('test-mode', true)
      expect(document.documentElement.classList.contains('test-mode')).toBe(true)

      toggleHtmlClass('test-mode', false)
      expect(document.documentElement.classList.contains('test-mode')).toBe(false)
    })

    it('detects and listens to system dark mode preferences', () => {
      expect(isSystemDarkMode()).toBe(false)

      let capturedListener: (e: MediaQueryListEvent) => void = () => {}
      const mockRemove = vi.fn<() => void>()

      window.matchMedia = vi.fn<typeof window.matchMedia>().mockImplementation((query: string) => {
        return {
          matches: query.includes('dark'),
          media: query,
          onchange: null,
          addListener: vi.fn<() => void>(),
          removeListener: vi.fn<() => void>(),
          addEventListener: vi.fn<(event: string, cb: (e: MediaQueryListEvent) => void) => void>(
            (_event: string, cb: (e: MediaQueryListEvent) => void) => {
              capturedListener = cb
            },
          ),
          removeEventListener: mockRemove,
          dispatchEvent: vi.fn<() => boolean>(),
        } as unknown as MediaQueryList
      })

      expect(isSystemDarkMode()).toBe(true)

      let darkDetected = false
      const unwatch = watchSystemDarkMode((isDark) => {
        darkDetected = isDark
      })

      capturedListener({ matches: true } as MediaQueryListEvent)
      expect(darkDetected).toBe(true)

      unwatch()
      expect(mockRemove).toHaveBeenCalled()
    })
  })
})
