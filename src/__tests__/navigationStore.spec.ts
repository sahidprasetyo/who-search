import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNavigationStore } from '@/stores/useNavigationStore'

describe('useNavigationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default personality and expanded category', () => {
    const store = useNavigationStore()
    expect(store.selectedPerson).not.toBeNull()
    expect(store.selectedPerson?.name).toBe('Albert Einstein')
    expect(store.selectedCategoryId).toBe('scientists')
    expect(store.selectedSubCategoryId).toBe('international')
    expect(store.isCategoryExpanded('scientists')).toBe(true)
    expect(store.isMobileDrawerOpen).toBe(false)
  })

  it('selects a person and automatically closes mobile drawer', () => {
    const store = useNavigationStore()
    store.setMobileDrawerOpen(true)
    expect(store.isMobileDrawerOpen).toBe(true)

    const newPerson = {
      id: 'curie',
      name: 'Marie Curie',
      title: 'Physicist',
      wikiSearchQuery: 'Marie Curie',
    }

    store.selectPerson(newPerson, 'scientists', 'international')
    expect(store.selectedPerson?.id).toBe('curie')
    expect(store.selectedPerson?.name).toBe('Marie Curie')
    expect(store.isMobileDrawerOpen).toBe(false)
  })

  it('toggles category expansion correctly', () => {
    const store = useNavigationStore()
    expect(store.isCategoryExpanded('actors')).toBe(false)

    store.toggleCategory('actors')
    expect(store.isCategoryExpanded('actors')).toBe(true)

    store.toggleCategory('actors')
    expect(store.isCategoryExpanded('actors')).toBe(false)
  })

  it('updates subcategory and ensures category is expanded', () => {
    const store = useNavigationStore()
    store.selectSubCategory('politicians', 'indonesia')

    expect(store.selectedCategoryId).toBe('politicians')
    expect(store.selectedSubCategoryId).toBe('indonesia')
    expect(store.isCategoryExpanded('politicians')).toBe(true)
  })

  it('toggles mobile drawer open state', () => {
    const store = useNavigationStore()
    expect(store.isMobileDrawerOpen).toBe(false)

    store.toggleMobileDrawer()
    expect(store.isMobileDrawerOpen).toBe(true)

    store.setMobileDrawerOpen(false)
    expect(store.isMobileDrawerOpen).toBe(false)
  })
})
