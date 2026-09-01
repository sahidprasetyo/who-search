/**
 * Pure URL and query parameter manipulation helpers.
 * Zero UI/Vue reactivity dependencies.
 */

/**
 * Extracts a clean, human-readable domain hostname from a URL string.
 * Strips leading 'www.' for concise display.
 */
export function formatDomain(url: string): string {
  if (!url) {
    return ''
  }
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/**
 * Constructs a full URL from a base URL and an object of query parameters.
 */
export function buildUrlWithParams(baseUrl: string, params: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(baseUrl)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

/**
 * Validates whether a string is a well-formed HTTP/HTTPS URL.
 */
export function isValidUrl(urlString: string): boolean {
  if (!urlString) {
    return false
  }
  try {
    const parsed = new URL(urlString)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}
