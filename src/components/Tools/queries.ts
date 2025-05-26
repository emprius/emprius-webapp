import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useEffect } from 'react'
import api, { tools } from '~src/services/api'
import { CreateToolParams, Tool, ToolDTO, ToolDetail, ToolsListResponse, UpdateToolParams } from './types'
import { useTranslation } from 'react-i18next'
import { QueryKey } from '@tanstack/react-query/build/modern/index'
import { UnifiedRating } from '~components/Ratings/types'
import { toEmpriusLocation, toLatLng } from '~src/utils'
import { ToolHistoryEntry, ToolHistoryResponse } from '~components/Users/types'
import { convertToDate } from '~utils/dates'
import { useDebouncedSearch } from '~components/Layout/Search/DebouncedSearchContext'
import { useRoutedPagination } from '~components/Layout/Pagination/PaginationProvider'

export const ToolsKeys = {
  toolsOwner: ['tools', 'owner'], // Used to invalidate queries
  toolsList: (page?: number, term?: string): QueryKey => ['tools', 'owner', page, term],
  userTools: (userId: string, page?: number, term?: string): QueryKey => ['tools', 'user', userId, page, term],
  tool: (id: string): QueryKey => ['tool', id],
  toolRatings: (id: string): QueryKey => ['tool', id, 'rating'],
  toolHistory: (id: string): QueryKey => ['tool', id, 'history'],
}

export const useTool = (
  id: string,
  options?: Omit<UseQueryOptions<ToolDTO, Error, ToolDetail>, 'queryKey' | 'queryFn' | 'select'>
) => {
  const { t } = useTranslation()
  const query = useQuery({
    queryKey: ToolsKeys.tool(id),
    queryFn: () => api.tools.getById(id),
    select: (data): ToolDetail => ({
      ...data,
      location: toLatLng(data?.location),
    }),
    enabled: !!id,
    ...options,
  })

  // Show placeholder if the tool is not found
  if (query.isError) {
    const notFoundTool: Tool = {
      id: parseInt(id),
      title: t('tools.not_found_title'),
      description: t('tools.not_found_description'),
      userId: '',
      images: [],
      rating: 0,
      reservedDates: null,
      isAvailable: false,
    }
    return { ...query, data: notFoundTool }
  }

  return query
}

export type UseToolsParams = { page?: number; term?: string }

export const useTools = () => {
  const { debouncedSearch: term } = useDebouncedSearch()
  const { page } = useRoutedPagination()

  return useQuery({
    queryKey: ToolsKeys.toolsList(page, term),
    queryFn: () => api.tools.getUserTools({ page, term }),
  })
}

export const useUserTools = (
  userId: string,
  options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof api.tools.getUserToolsById>>, Error>, 'queryKey' | 'queryFn'>
) => {
  const { debouncedSearch: term } = useDebouncedSearch()
  const { page } = useRoutedPagination()
  return useQuery({
    queryKey: ToolsKeys.userTools(userId, page, term),
    queryFn: () => api.tools.getUserToolsById(userId, { term, page }),
    enabled: !!userId,
    ...options,
  })
}

export const useDeleteTool = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.tools.delete(id),
    onSuccess: (data, id) => {
      // Invalidate tool queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ToolsKeys.toolsOwner })
      queryClient.removeQueries({ queryKey: ToolsKeys.tool(id) })
    },
  })
}

export const useCreateTool = (options?: Omit<UseMutationOptions<ToolDTO, Error, CreateToolParams>, 'mutationFn'>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tool) => tools.create({ ...tool, location: toEmpriusLocation(tool.location) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ToolsKeys.toolsOwner })
    },
    ...options,
  })
}

export const useUpdateTool = (
  options?: Omit<UseMutationOptions<ToolDTO, Error, Partial<UpdateToolParams>>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tool) => tools.update({ ...tool, location: toEmpriusLocation(tool.location) }),
    onSuccess: (data, params) => {
      queryClient.invalidateQueries({ queryKey: ToolsKeys.toolsOwner })
      queryClient.invalidateQueries({ queryKey: ToolsKeys.tool(params.id.toString()) })
    },
    ...options,
  })
}

export const useToolRatings = (
  id: string,
  options?: Omit<UseQueryOptions<UnifiedRating[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ToolsKeys.toolRatings(id),
    queryFn: () => api.tools.getRatings(id),
    enabled: !!id,
    ...options,
  })
}

export const useToolHistory = (
  id: string,
  options?: Omit<UseQueryOptions<ToolHistoryResponse, Error, ToolHistoryEntry[]>, 'queryKey' | 'queryFn' | 'select'>
) => {
  return useQuery({
    queryKey: ToolsKeys.toolHistory(id),
    queryFn: () => api.tools.getHistory(id),
    enabled: !!id,
    select: (data) =>
      data.map((entry) => ({
        ...entry,
        location: toLatLng(entry.location),
        pickupDate: convertToDate(entry.pickupDate),
      })),
    ...options,
  })
}
