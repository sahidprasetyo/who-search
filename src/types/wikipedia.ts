import type { SearchResultItem } from './search'

export type { SearchResultItem }

export interface WikiSearchResult {
  pageid?: number
  position?: number
  title: string
  snippet: string
  link?: string
  timestamp?: string
  wordcount?: number
  displayed_link?: string
  favicon?: string
  source?: string
}

export interface WikiSearchInfo {
  totalhits: number
  suggestion?: string
  suggestionsnippet?: string
}

export interface WikiSearchResponse {
  batchcomplete?: string
  continue?: {
    sroffset: number
    continue: string
  }
  query?: {
    searchinfo?: WikiSearchInfo
    search: WikiSearchResult[]
  }
  error?: {
    code: string
    info: string
  }
}
