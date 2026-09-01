import { defineStore } from 'pinia'
import { personalitiesData } from '@/data/personalities'
import type { Category, Person, SubCategory, SubCategoryId } from '@/types'

interface NavigationState {
  categories: Category[]
  selectedPerson: Person | null
  selectedCategoryId: string
  selectedSubCategoryId: SubCategoryId
  expandedCategoryIds: string[]
  isMobileDrawerOpen: boolean
}

export const useNavigationStore = defineStore('navigation', {
  state: (): NavigationState => {
    const initialCategory = personalitiesData[0]
    const initialSubCategory = initialCategory?.subCategories[0]
    const initialPerson = initialSubCategory?.people[0] ?? null

    return {
      categories: personalitiesData,
      selectedPerson: initialPerson,
      selectedCategoryId: initialCategory?.id ?? '',
      selectedSubCategoryId: (initialSubCategory?.id as SubCategoryId) ?? 'international',
      expandedCategoryIds: initialCategory ? [initialCategory.id] : [],
      isMobileDrawerOpen: false,
    }
  },

  getters: {
    isCategoryExpanded: (state) => {
      return (categoryId: string): boolean => state.expandedCategoryIds.includes(categoryId)
    },
    activeCategory: (state): Category | undefined => {
      return state.categories.find((c) => c.id === state.selectedCategoryId)
    },
    activeSubCategory: (state): SubCategory | undefined => {
      const category = state.categories.find((c) => c.id === state.selectedCategoryId)
      return category?.subCategories.find((s) => s.id === state.selectedSubCategoryId)
    },
  },

  actions: {
    selectPerson(person: Person, categoryId?: string, subCategoryId?: SubCategoryId): void {
      this.selectedPerson = person
      if (categoryId) {
        this.selectedCategoryId = categoryId
        if (!this.expandedCategoryIds.includes(categoryId)) {
          this.expandedCategoryIds.push(categoryId)
        }
      }
      if (subCategoryId) {
        this.selectedSubCategoryId = subCategoryId
      }
      // Auto close mobile drawer on selection
      this.isMobileDrawerOpen = false
    },

    toggleCategory(categoryId: string): void {
      const index = this.expandedCategoryIds.indexOf(categoryId)
      if (index > -1) {
        this.expandedCategoryIds.splice(index, 1)
      } else {
        this.expandedCategoryIds.push(categoryId)
      }
    },

    selectSubCategory(categoryId: string, subCategoryId: SubCategoryId): void {
      this.selectedCategoryId = categoryId
      this.selectedSubCategoryId = subCategoryId
      if (!this.expandedCategoryIds.includes(categoryId)) {
        this.expandedCategoryIds.push(categoryId)
      }
    },

    setMobileDrawerOpen(isOpen: boolean): void {
      this.isMobileDrawerOpen = isOpen
    },

    toggleMobileDrawer(): void {
      this.isMobileDrawerOpen = !this.isMobileDrawerOpen
    },
  },
})
