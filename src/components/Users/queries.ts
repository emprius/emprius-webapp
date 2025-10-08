import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { EditProfileFormData, NotificationPreferences, UserProfile, UserProfileDTO } from '~components/Users/types'
import api, { users } from '~src/services/api'
import { toEmpriusLocation, toLatLng } from '~src/utils'

export const userFromUserDTO = (data: UserProfileDTO): UserProfile => ({
  ...data,
  ...(data?.location && { location: toLatLng(data.location) }),
})

export const UserKeys = {
  currentUser: ['user', 'current'],
  userId: (userId: string) => ['user', userId],
  userRatings: (userId: string, page: number) => ['user', userId, 'ratings', page] as const,
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
      // todo(kon): backend is not sending location properly to preupdate the query with response info
      // client.setQueryData<EditProfileFormData>(UserKeys.currentUser, (old) => ({
      //   ...old,
      //   ...userFromUserDTO(data),
      // }))
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
    select: (data): UserProfile => userFromUserDTO(data),
    enabled: userId != undefined,
    ...options,
  })

export const useUsers = ({ page, username }: { page: number; username?: string }) =>
  useQuery({
    queryKey: UserKeys.users(page, username),
    queryFn: () => users.getList({ page, term: username }),
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

export const useNotificationPreferences = () => {
  const client = useQueryClient()
  return useMutation({
    mutationKey: ['notificationPreferences'],
    mutationFn: (data: NotificationPreferences) => users.updateNotificationPreferences(data),
    onSuccess: async (data) => {
      await client.invalidateQueries({ queryKey: UserKeys.currentUser })
      return data
    },
  })
}
