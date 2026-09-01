import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useTheme } from '@/composables/useTheme'
import ThemeToggle from '@/components/ThemeToggle.vue'

describe('useTheme Composable', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    vi.restoreAllMocks()
  })

  it('sets dark theme and updates documentElement classes', () => {
    const { theme, isDark, setTheme } = useTheme()
    setTheme('dark')

    expect(theme.value).toBe('dark')
    expect(isDark.value).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
    expect(localStorage.getItem('who-search-theme')).toBe('dark')
  })

  it('sets light theme and updates documentElement classes', () => {
    const { theme, isDark, setTheme } = useTheme()
    setTheme('light')

    expect(theme.value).toBe('light')
    expect(isDark.value).toBe(false)
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('who-search-theme')).toBe('light')
  })

  it('toggles theme between light and dark', () => {
    const { isDark, setTheme, toggleTheme } = useTheme()
    setTheme('light')
    expect(isDark.value).toBe(false)

    toggleTheme()
    expect(isDark.value).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    toggleTheme()
    expect(isDark.value).toBe(false)
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })
})

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('renders with accessible aria-label and toggles theme on click', async () => {
    const { setTheme } = useTheme()
    setTheme('light')

    const wrapper = mount(ThemeToggle)
    expect(wrapper.attributes('aria-label')).toBe('Switch to dark mode')

    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-label')).toBe('Switch to light mode')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
