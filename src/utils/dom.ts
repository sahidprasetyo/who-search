/**
 * Pure DOM and media query helper functions.
 * Encapsulates browser/window interactions without Vue reactivity.
 */

/**
 * Toggles a class on the documentElement (<html>) safely.
 */
export function toggleHtmlClass(className: string, shouldAdd: boolean): void {
  if (typeof document === 'undefined' || !document.documentElement) {
    return
  }
  if (shouldAdd) {
    document.documentElement.classList.add(className)
  } else {
    document.documentElement.classList.remove(className)
  }
}

/**
 * Checks whether the user's operating system prefers dark mode.
 */
export function isSystemDarkMode(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Attaches a listener for OS dark mode changes and returns an unsubscribe function.
 */
export function watchSystemDarkMode(callback: (isDark: boolean) => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const listener = (event: MediaQueryListEvent): void => {
    callback(event.matches)
  }
  mediaQuery.addEventListener('change', listener)
  return () => {
    mediaQuery.removeEventListener('change', listener)
  }
}
