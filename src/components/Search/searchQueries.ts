import { useMutation } from '@tanstack/react-query'
import { Tool } from '~components/Tools/types'
import api from '~src/services/api'

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

export const useSearchTools = () =>
  useMutation({
    mutationFn: (params: SearchFilters) => api.tools.searchTools(params),
  })

export interface SearchFilters {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  startDate?: string
  endDate?: string
  lat?: number
  lng?: number
  radius?: number
}
