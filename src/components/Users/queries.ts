import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { EditProfileFormData, GetUsers, GetUsersDTO, UserProfile, UserProfileDTO } from '~components/Users/types'
import api, { users } from '~src/services/api'
import { toEmpriusLocation, toLatLng } from '~src/utils'

export const UserKeys = {
  currentUser: ['currentUser'],
  userId: (userId: string) => ['user', userId],
  users: (page: number) => ['users', page],
}

export const useUpdateUserProfile = () => {
  const client = useQueryClient()
  return useMutation<UserProfileDTO, Error, EditProfileFormData>({
    mutationFn: (data) => {
      return api.users.updateProfile({ ...data, location: toEmpriusLocation(data.location) })
    },
    mutationKey: ['updateProfile'],
    // Invalidate profile query after mutation
    onSuccess: async (data) => {
      await client.invalidateQueries({ queryKey: UserKeys.currentUser })
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

export const useUsers = ({ page }: { page: number }) =>
  useQuery<GetUsersDTO>({
    queryKey: UserKeys.users(page),
    queryFn: () => users.getList(page),
  })
