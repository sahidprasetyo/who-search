/**
 * Pure, exception-safe browser localStorage access utilities.
 * Zero UI/Vue reactivity dependencies.
 */

/**
 * Safely retrieves an item from localStorage with a fallback default.
 */
export function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback
  }
  try {
    const item = window.localStorage.getItem(key)
    if (item === null) {
      return fallback
    }
    return (item as unknown) as T
  } catch {
    return fallback
  }
}

/**
 * Safely persists an item into localStorage, handling private browsing or storage quota errors.
 */
export function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Gracefully handle storage errors
  }
}

/**
 * Safely removes an item from localStorage.
 */
export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Gracefully handle removal errors
  }
}
