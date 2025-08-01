import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import api from '~src/services/api'
import { EmpriusLocation } from '~components/Layout/Map/types'
import { Invite, OwnUserProfile, OwnUserProfileDTO, UserProfile, UserProfileDTO } from '~components/Users/types'
import { UserKeys } from '~components/Users/queries'
import { toEmpriusLocation, toLatLng } from '~src/utils'
import { RegisterFormData } from '~components/Auth/Register'
import { convertToDate } from '~utils/dates'

export interface ILoginParams {
  email: string
  password: string
}

export type IRegisterParams = {
  email: string
  invitationToken: string
  name?: string
  password?: string
  community?: string
  location?: EmpriusLocation
  lang?: string
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
  options?: Omit<UseMutationOptions<LoginResponse, Error, RegisterFormData>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: (params: RegisterFormData) =>
      api.auth.register({ ...params, location: toEmpriusLocation(params.location) }),
    ...options,
  })
}
export const useCurrentUser = (
  options?: Omit<UseQueryOptions<OwnUserProfileDTO, Error, OwnUserProfile>, 'queryKey' | 'mutationFn'>
) =>
  useQuery({
    queryKey: UserKeys.currentUser,
    queryFn: () => api.auth.getCurrentUser(),
    select: (data): OwnUserProfile => ({
      ...data,
      location: toLatLng(data?.location),
      inviteCodes: data?.inviteCodes?.map(
        (invite): Invite => ({
          ...invite,
          createdOn: convertToDate(invite.createdOn),
        })
      ),
    }),
    ...options,
  })
