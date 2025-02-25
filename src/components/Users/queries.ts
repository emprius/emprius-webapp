import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { EditProfileFormData, UserProfile } from '~components/Users/types'
import api, { users } from '~src/services/api'

export const UserKeys = {
  currentUser: ['currentUser'],
  userId: (userId: string) => ['user', userId],
  users: (page: number) => ['users', page],
}

export const useUpdateUserProfile = () => {
  const client = useQueryClient()
  return useMutation<UserProfile, Error, EditProfileFormData>({
    mutationFn: (data) => api.users.updateProfile(data),
    mutationKey: ['updateProfile'],
    // Invalidate profile query after mutation
    onSuccess: async (data) => {
      await client.invalidateQueries({ queryKey: UserKeys.currentUser })
      return data
    },
  })
}

// Query to get a user information
export const useUserProfile = (userId: string, options?: Omit<UseQueryOptions<UserProfile>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: UserKeys.userId(userId),
    queryFn: () => api.users.getById(userId),
    ...options,
  })

export const useUsers = ({ page }: { page: number }) =>
  useQuery({
    queryKey: UserKeys.users(page),
    queryFn: () => users.getList(page),
  })
