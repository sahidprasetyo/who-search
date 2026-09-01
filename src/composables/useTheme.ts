import { ref, type Ref } from 'vue'
import type { ThemeMode } from '@/types/theme'
import { isSystemDarkMode, toggleHtmlClass, watchSystemDarkMode } from '@/utils/dom'
import { getStorageItem, setStorageItem } from '@/utils/storage'

export type { ThemeMode }

const THEME_STORAGE_KEY = 'who-search-theme'

const currentTheme: Ref<ThemeMode> = ref<ThemeMode>('system')
const isDark: Ref<boolean> = ref<boolean>(false)
let isInitialized = false
let unwatchSystem: (() => void) | null = null

export function useTheme(): {
  theme: Ref<ThemeMode>
  isDark: Ref<boolean>
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
  initTheme: () => void
} {
  function updateDOM(dark: boolean): void {
    isDark.value = dark
    toggleHtmlClass('dark', dark)
    toggleHtmlClass('light', !dark)
  }

  function setTheme(mode: ThemeMode): void {
    currentTheme.value = mode
    setStorageItem(THEME_STORAGE_KEY, mode)

    if (mode === 'system') {
      updateDOM(isSystemDarkMode())
    } else {
      updateDOM(mode === 'dark')
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
    if (isInitialized) {
      return
    }
    isInitialized = true

    const savedTheme = getStorageItem<ThemeMode>(THEME_STORAGE_KEY, 'system')
    const validTheme: ThemeMode = ['light', 'dark', 'system'].includes(savedTheme)
      ? savedTheme
      : 'system'

    setTheme(validTheme)

    if (unwatchSystem) {
      unwatchSystem()
    }
    unwatchSystem = watchSystemDarkMode((prefersDark) => {
      if (currentTheme.value === 'system') {
        updateDOM(prefersDark)
      }
    })
  }

  return {
    theme: currentTheme,
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
  }
}
