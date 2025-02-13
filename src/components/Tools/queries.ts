import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { EmpriusLocation } from '~components/Layout/types'
import api, { tools } from '~src/services/api'
import { Tool, ToolsListResponse } from './types'

export interface createToolParams {
  title: string
  description?: string
  cost?: number // uint64
  images: string[]
  toolCategory?: number // uint
  location: EmpriusLocation
  estimatedValue?: number // uint64
  height?: number // uint64
  weight?: number // uint64
  isAvailable?: boolean
}

export interface UpdateToolParams extends createToolParams {
  id: string
}

export const useTool = (id: string, options?: Omit<UseQueryOptions<Tool, Error>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: ['tool', id],
    queryFn: () => api.tools.getById(id),
    enabled: !!id,
    ...options,
  })

export const useTools = () =>
  useQuery({
    queryKey: ['tools'],
    queryFn: () => api.tools.getUserTools(),
  })

export const useUserTools = (
  userId: string,
  options?: Omit<UseQueryOptions<ToolsListResponse, Error>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: ['userTools', userId],
    queryFn: () => api.tools.getUserToolsById(userId),
    enabled: !!userId,
    ...options,
  })

export const useDeleteTool = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.tools.delete(id),
    onSuccess: (data, id) => {
      // Invalidate tool queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['tools'] })
      queryClient.removeQueries({ queryKey: ['tool', id] })
    },
  })
}

export const useCreateTool = (options?: Omit<UseMutationOptions<Tool, Error, createToolParams>, 'mutationFn'>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tools.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] })
    },
    ...options,
  })
}

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
