import { useMutation } from '@tanstack/react-query'
import { ToolLocated } from '~components/Tools/types'
import api from '~src/services/api'
import { UseMutationOptions } from '@tanstack/react-query/build/modern/index'
import { toLatLng } from '~src/utils'

export interface SearchParams {
  term?: string
  categories?: number[]
  transportOptions?: number[]
  distance?: number
  maxCost?: number
  mayBeFree?: boolean
}

export interface ToolsListSearch {
  tools: ToolLocated[]
}
export const useSearchTools = (
  options?: Omit<UseMutationOptions<ToolsListSearch, Error, SearchParams>, 'mutationFn'>
) =>
  useMutation({
    mutationFn: async (params: SearchParams) => {
      const response = await api.tools.searchTools(params) // This returns ToolsListResponse
      return {
        tools: response.tools.map((tool) => ({
          ...tool,
          location: tool.location ? toLatLng(tool.location) : undefined,
        })),
      }
    },
    ...options,
  })
