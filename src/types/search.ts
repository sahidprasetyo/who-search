export interface SearchResultItem {
  position?: number
  title: string
  link: string
  snippet: string
  displayed_link?: string
  favicon?: string
  source?: string
}

export interface SearchApiMetadata {
  id?: string
  status?: string
  created_at?: string
  request_time_taken?: number
}

export interface SearchApiParameters {
  engine?: string
  q?: string
  api_key?: string
}

export interface SearchApiResponse {
  search_metadata?: SearchApiMetadata
  search_parameters?: SearchApiParameters
  organic_results?: SearchResultItem[]
  error?: string
}
