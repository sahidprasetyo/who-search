export interface WikiSearchResult {
  pageid: number
  title: string
  snippet: string
  timestamp: string
  wordcount: number
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
