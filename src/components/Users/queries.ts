import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { EditProfileFormData, GetUsers, GetUsersDTO, UserProfile, UserProfileDTO } from '~components/Users/types'
import api, { users } from '~src/services/api'
import { toEmpriusLocation, toLatLng } from '~src/utils'

export const UserKeys = {
  currentUser: ['user', 'current'],
  userId: (userId: string) => ['user', userId],
  users: (page: number, username?: string) => ['users', page, username],
}

export const useUpdateUserProfile = () => {
  const client = useQueryClient()
  return useMutation<UserProfileDTO, Error, Partial<EditProfileFormData>>({
    mutationFn: (data) => {
      return api.users.updateProfile({ ...data, ...(data.location && { location: toEmpriusLocation(data.location) }) })
    },
    mutationKey: ['updateProfile'],
    onSuccess: async (data) => {
      await client.invalidateQueries({ queryKey: UserKeys.currentUser })
      await client.invalidateQueries({ queryKey: UserKeys.userId(data.id) })
      return data
    },
  })
}

// Query to get a user information
export const useUserProfile = (
  userId: string,
  options?: Omit<UseQueryOptions<UserProfileDTO, Error, UserProfile>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: UserKeys.userId(userId),
    queryFn: () => api.users.getById(userId),
    select: (data): UserProfile => ({
      ...data,
      location: toLatLng(data?.location),
    }),
    ...options,
  })

export const useUsers = ({ page, username }: { page: number; username?: string }) =>
  useQuery<GetUsersDTO>({
    queryKey: UserKeys.users(page, username),
    queryFn: () => users.getList(page, username),
  })

export const useRequestMoreCodes = () => {
  const client = useQueryClient()
  return useMutation({
    mutationKey: ['requestMoreCodes'],
    mutationFn: () => users.getMoreCodes(),
    onSuccess: async (data) => {
      await client.invalidateQueries({ queryKey: UserKeys.currentUser })
      return data
    },
  })
}
