import { useMutation } from '@tanstack/react-query'
import { ToolDetail } from '~components/Tools/types'
import api from '~src/services/api'
import { toLatLng } from '~src/utils'

export interface SearchParams {
  term?: string
  categories?: number[]
  transportOptions?: number[]
  distance?: number
  maxCost?: number
  mayBeFree?: boolean
  page?: number
}

export interface ToolsListSearch {
  tools: ToolDetail[]
}
export const useSearchTools = () =>
  useMutation({
    mutationFn: async (params: SearchParams) => {
      const response = await api.tools.searchTools(params) // This returns ToolsListResponse
      return {
        pagination: response.pagination,
        tools: response.tools.map((tool) => ({
          ...tool,
          location: tool.location ? toLatLng(tool.location) : undefined,
        })),
      }
    },
  })
