import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import api, { tools } from '~src/services/api'
import { CreateToolParams, Tool, ToolDetail, ToolDTO, UpdateToolParams } from './types'
import { useTranslation } from 'react-i18next'
import { QueryKey } from '@tanstack/react-query/build/modern/index'
import { toEmpriusLocation, toLatLng } from '~src/utils'
import { ToolHistoryEntry, ToolHistoryResponse } from '~components/Users/types'
import { convertToDate } from '~utils/dates'
import { useDebouncedSearch } from '~components/Layout/Search/DebouncedSearchContext'
import { useRoutedPagination } from '~components/Layout/Pagination/PaginationProvider'
import { SearchAndPaginationApiParams } from '~components/Layout/Search/SearchAndPagination'

export type ToolsListParams = { ownTools?: boolean; heldTools?: boolean } & SearchAndPaginationApiParams

export const ToolsKeys = {
  toolsOwner: ['tools', 'owner'], // Used to invalidate queries
  toolsList: ({ page, term, ownTools, heldTools }: ToolsListParams): QueryKey => [
    'tools',
    'owner',
    page,
    term,
    { ownTools, heldTools },
  ],
  userTools: (userId: string, { page, term, ownTools, heldTools }: ToolsListParams): QueryKey => [
    'tools',
    'user',
    userId,
    page,
    term,
    { ownTools, heldTools },
  ],
  tool: (id: string): QueryKey => ['tool', id],
  toolRatings: (id: string, page: number): QueryKey => ['tool', id, 'rating', page],
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
      userActive: false,
    }
    return { ...query, data: notFoundTool }
  }

  return query
}

export const useTools = (heldTools?: boolean) => {
  const { debouncedSearch: term } = useDebouncedSearch()
  const { page } = useRoutedPagination()

  return useQuery({
    queryKey: ToolsKeys.toolsList({ page, term, heldTools }),
    queryFn: () => api.tools.getUserTools({ page, term, heldTools }),
  })
}

export const useUserTools = (
  userId: string,
  options?: Omit<UseQueryOptions<Awaited<ReturnType<typeof api.tools.getUserToolsById>>, Error>, 'queryKey' | 'queryFn'>
) => {
  const { debouncedSearch: term } = useDebouncedSearch()
  const { page } = useRoutedPagination()
  return useQuery({
    queryKey: ToolsKeys.userTools(userId, { page, term }),
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
    mutationFn: (tool) =>
      tools.update({ ...tool, ...(tool.location && { location: toEmpriusLocation(tool.location) }) }),
    onSuccess: (_, params) => {
      const { id, ...restParams } = params
      // Set query data so not need to await the refetch
      queryClient.setQueryData<ToolDetail>(ToolsKeys.tool(id), (old) => ({
        ...old,
        ...restParams,
      }))
      queryClient.invalidateQueries({ queryKey: ToolsKeys.toolsOwner })
      queryClient.invalidateQueries({ queryKey: ToolsKeys.tool(id) })
    },
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
