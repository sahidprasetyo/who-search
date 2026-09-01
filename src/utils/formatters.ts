/**
 * Pure string transformation and formatting utilities.
 * Zero UI/Vue reactivity dependencies.
 */

/**
 * Strips HTML tags and decodes common HTML entity references.
 */
export function stripHtmlTags(html: string): string {
  if (!html) {
    return ''
  }
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

/**
 * Truncates text to a specified maximum length with an optional ellipsis suffix.
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (!text || text.length <= maxLength) {
    return text || ''
  }
  return `${text.slice(0, maxLength).trimEnd()}${suffix}`
}
