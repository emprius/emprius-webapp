import { useMutation } from '@tanstack/react-query'
import { Tool } from '~components/Tools/types'
import api from '~src/services/api'
import { UseMutationOptions } from '@tanstack/react-query/build/modern/index'

export interface SearchParams {
  term?: string
  categories?: number[]
  transportOptions?: number[]
  distance?: number
  maxCost?: number
  mayBeFree?: boolean
}

export interface SearchToolsResponse {
  tools: Tool[]
}

export const useSearchTools = (
  options?: Omit<UseMutationOptions<SearchToolsResponse, Error, SearchParams>, 'mutationFn'>
) =>
  useMutation({
    mutationFn: (params: SearchParams) => api.tools.searchTools(params),
    ...options,
  })
