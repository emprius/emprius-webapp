import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { SearchFilters } from '~components/Search/searchQueries'
import api, { tools } from '~src/services/api'
import { Tool } from './types'
import { EmpriusLocation } from '~components/Layout/types'

export interface createToolParams {
  title: string
  description: string
  mayBeFree: boolean
  askWithFee: boolean
  cost: number // uint64
  images: string[]
  transportOptions: number[] // []uint
  category: number // uint
  location: EmpriusLocation
  estimatedValue: number // uint64
  height: number // uint64
  weight: number // uint64
  isAvailable?: boolean
}

export interface UpdateToolParams extends createToolParams {
  id: string
}

export const useCreateTool = (options?: Omit<UseMutationOptions<Tool, Error, createToolParams>, 'mutationFn'>) =>
  useMutation({
    mutationFn: tools.create,
    ...options,
  })

export const useUpdateTool = (
  options?: Omit<UseMutationOptions<Tool, Error, Partial<UpdateToolParams>>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tools.update,
    onSuccess: (data, params) => {
      queryClient.invalidateQueries({ queryKey: ['tools'] })
      queryClient.invalidateQueries({ queryKey: ['tool', params.id.toString()] })
    },
    ...options,
  })
}

// Tools queries
export const useTools = (filters?: SearchFilters) =>
  useQuery({
    queryKey: ['tools', filters],
    queryFn: () => (filters ? api.tools.searchTools(filters) : api.tools.getUserTools()),
  })
export const useTool = (
  id: string,
  options?: Omit<UseMutationOptions<Tool, Error, Partial<UpdateToolParams>>, 'mutationFn' | 'queryFn'>
) =>
  useQuery({
    queryKey: ['tool', id],
    queryFn: () => api.tools.getById(id),
    enabled: !!id,
    ...options,
  })

export const useDeleteTool = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.tools.delete(id),
    onSuccess: () => {
      // Invalidate tool queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['tools'] })
    },
  })
}
export const useUserTools = () =>
  useQuery({
    queryKey: ['userTools'],
    queryFn: () => api.tools.getUserTools(),
  })
