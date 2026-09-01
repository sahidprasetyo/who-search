import type { Category, Person, SubCategoryId } from './personality'
import type { SearchResultItem } from './search'

// AppHeader
export interface AppHeaderProps {
  title?: string
  subtitle?: string
}

export interface AppHeaderEmits {
  toggleDrawer: []
}

// CategoryAccordion
export interface CategoryAccordionProps {
  categories?: Category[]
  selectedPerson?: Person | null
  expandedCategoryIds?: string[]
  selectedCategoryId?: string
  selectedSubCategoryId?: SubCategoryId
  isLoading?: boolean
}

export interface CategoryAccordionEmits {
  selectPerson: [person: Person, categoryId: string, subCategoryId: SubCategoryId]
  toggleCategory: [categoryId: string]
  selectSubCategory: [categoryId: string, subCategoryId: SubCategoryId]
}

// ContentViewer
export interface ContentViewerProps {
  articleTitle?: string
  articleUrl?: string | null
}

export interface ContentViewerEmits {
  openExternal: [url: string]
}

// MobileDrawer
export interface MobileDrawerProps {
  isOpen?: boolean
}

export interface MobileDrawerEmits {
  close: []
}

// PillButton
export interface PillButtonProps {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  href?: string
  target?: string
  rel?: string
}

export interface PillButtonEmits {
  click: [event: MouseEvent]
}

// SearchResultsViewer
export interface SearchResultsViewerProps {
  results?: SearchResultItem[]
  selectedResult?: SearchResultItem | null
  isLoading?: boolean
  error?: string | null
  personName?: string
  personTitle?: string
}

export interface SearchResultsViewerEmits {
  selectResult: [result: SearchResultItem]
  retry: []
}

// SurfaceCard
export interface SurfaceCardProps {
  as?: string
  variant?: 'canvas' | 'tint'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// Skeleton Primitives & Layout Wrappers
export interface SkeletonProps {
  as?: string
  width?: string
  height?: string
  rounded?: 'none' | 'sm' | 'inputs' | 'cards' | 'buttons' | 'tags' | 'footer' | 'full'
  class?: string
}

export interface SearchResultsSkeletonProps {
  rows?: number
}

export interface CategoryListSkeletonProps {
  count?: number
}
