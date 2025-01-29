import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import api from '~src/services/api'
import { InfoData } from './infoTypes'

export const useInfo = (options?: Omit<UseQueryOptions<InfoData>, 'queryKey' | 'queryFn'>) => {
  return useQuery<InfoData>({
    queryKey: ['info'],
    queryFn: () => api.info.getInfo(),
    ...options,
  })
}
