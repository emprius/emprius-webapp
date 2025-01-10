import { useQuery } from '@tanstack/react-query'
import api from '~src/services/api'
import { Tool } from '~src/types'

export interface SearchFilters {
  term?: string
  categories?: number[]
  distance?: number
  maxCost?: number
  mayBeFree?: boolean
  latitude?: number
  longitude?: number
}

export interface SearchToolsResponse {
  tools: Tool[]
}

export const useSearchTools = (params: SearchFilters) =>
  useQuery({
    queryKey: ['searchTools', params],
    queryFn: () => api.tools.searchTools(params),
    enabled: !!params,
  })
