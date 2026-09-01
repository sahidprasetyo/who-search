import { ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

const currentTheme = ref<ThemeMode>('system')
const isDark = ref<boolean>(false)

export function useTheme(): {
  theme: typeof currentTheme
  isDark: typeof isDark
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
  initTheme: () => void
} {
  function updateDOM(dark: boolean): void {
    isDark.value = dark
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      }
    }
  }

  function setTheme(mode: ThemeMode): void {
    currentTheme.value = mode
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('who-search-theme', mode)
      } catch {
        // Handle storage quota or private browsing exceptions
      }

      if (mode === 'system') {
        const systemPrefersDark =
          typeof window.matchMedia === 'function'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
            : false
        updateDOM(systemPrefersDark)
      } else {
        updateDOM(mode === 'dark')
      }
    }
  }

  function toggleTheme(): void {
    if (isDark.value) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  function initTheme(): void {
    if (typeof window !== 'undefined') {
      let savedTheme: ThemeMode = 'system'
      try {
        const stored = localStorage.getItem('who-search-theme') as ThemeMode | null
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          savedTheme = stored
        }
      } catch {
        // Fallback to system
      }

      setTheme(savedTheme)

      // Listen for OS system theme changes if matchMedia is supported
      if (typeof window.matchMedia === 'function') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const listener = (event: MediaQueryListEvent): void => {
          if (currentTheme.value === 'system') {
            updateDOM(event.matches)
          }
        }
        mediaQuery.addEventListener?.('change', listener)
      }
    }
  }

  return {
    theme: currentTheme,
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
  }
}
