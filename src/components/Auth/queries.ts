import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import api from '~src/services/api'
import { EmpriusLocation } from '~components/Layout/Map/types'
import { UserProfile, UserProfileDTO } from '~components/Users/types'
import { UserKeys } from '~components/Users/queries'
import { toLatLng } from '~src/utils'

export interface ILoginParams {
  email: string
  password: string
}

export interface IRegisterParams {
  email: string
  invitationToken: string
  name?: string
  password?: string
  community?: string
  location?: EmpriusLocation
}

export interface LoginResponse {
  token: string
  expirity: string
}

export const useLogin = (options?: Omit<UseMutationOptions<LoginResponse, Error, ILoginParams>, 'mutationFn'>) => {
  return useMutation({
    mutationFn: (params: ILoginParams) => api.auth.login(params),
    ...options,
  })
}

export const useRegister = (
  options?: Omit<UseMutationOptions<LoginResponse, Error, IRegisterParams>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: (params: IRegisterParams) => api.auth.register(params),
    ...options,
  })
}
export const useCurrentUser = (
  options?: Omit<UseQueryOptions<UserProfileDTO, Error, UserProfile>, 'queryKey' | 'mutationFn'>
) =>
  useQuery({
    queryKey: UserKeys.currentUser,
    queryFn: () => api.auth.getCurrentUser(),
    select: (data): UserProfile => ({
      ...data,
      location: toLatLng(data?.location),
    }),
    ...options,
  })
