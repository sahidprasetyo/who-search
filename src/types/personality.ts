export type SubCategoryId = 'international' | 'indonesia'

export interface Person {
  id: string
  name: string
  title: string
  searchQuery?: string
  wikiSearchQuery: string
}

export interface SubCategory {
  id: SubCategoryId
  name: string
  people: Person[]
}

export interface Category {
  id: string
  name: string
  icon?: string
  subCategories: SubCategory[]
}
