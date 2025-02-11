import { useMutation } from '@tanstack/react-query'
import { ToolsListResponse } from '~components/Tools/types'
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

export const useSearchTools = (
  options?: Omit<UseMutationOptions<ToolsListResponse, Error, SearchParams>, 'mutationFn'>
) =>
  useMutation({
    mutationFn: (params: SearchParams) => api.tools.searchTools(params),
    ...options,
  })
