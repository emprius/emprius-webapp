import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import api from '~src/services/api'

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
