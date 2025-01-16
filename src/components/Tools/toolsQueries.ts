import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { SearchFilters } from '~components/Search/searchQueries'
import api, { tools } from '~src/services/api'
import { Tool } from '~src/types'

export interface createToolParams {
  title: string
  description: string
  mayBeFree: boolean
  askWithFee: boolean
  cost: number // uint64
  images: string[]
  transportOptions: number[] // []uint
  category: number // uint
  location: {
    latitude: number // int64
    longitude: number // int64
  }
  estimatedValue: number // uint64
  height: number // uint64
  weight: number // uint64
}

export interface UpdateToolParams extends createToolParams {
  id: string
}

export const useCreateTool = (options?: Omit<UseMutationOptions<Tool, Error, createToolParams>, 'mutationFn'>) =>
  useMutation({
    mutationFn: tools.create,
    ...options,
  })

export const useUpdateTool = (options?: Omit<UseMutationOptions<Tool, Error, UpdateToolParams>, 'mutationFn'>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tools.update,
    onSuccess: (data) => {
      // Invalidate tool queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['tools'] })
      queryClient.invalidateQueries({ queryKey: ['tool', data.id.toString()] })
    },
    ...options,
  })
}

// Tools queries
export const useTools = (filters?: SearchFilters) =>
  useQuery({
    queryKey: ['tools', filters],
    queryFn: () => api.tools.getUserTools(filters),
  })
export const useTool = (id: string) =>
  useQuery({
    queryKey: ['tool', id],
    queryFn: () => api.tools.getById(id),
    enabled: !!id,
  })

export const useDeleteTool = () =>
  useMutation({
    mutationFn: (id: string) => api.tools.delete(id),
  })
export const useUserTools = () =>
  useQuery({
    queryKey: ['userTools'],
    queryFn: () => api.tools.getUserTools(),
  })
