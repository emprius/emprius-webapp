import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { UserProfile } from '~components/User/userTypes'
import api from '~src/services/api'

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
  location?: {
    latitude: number
    longitude: number
  }
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
export const useCurrentUser = (options?: Omit<UseQueryOptions<UserProfile>, 'queryKey' | 'mutationFn'>) =>
  useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.auth.getCurrentUser(),
    ...options,
  })
