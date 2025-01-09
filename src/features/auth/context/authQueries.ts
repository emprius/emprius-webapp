import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import api from '~src/services/api'
import { UserProfile } from '~src/types'

export interface ILoginParams {
  email: string
  password: string
}

export interface IRegisterParams extends ILoginParams {
  name: string
  confirmPassword: string
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
