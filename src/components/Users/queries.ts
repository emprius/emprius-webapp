import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { EditProfileFormData, UserProfile } from '~components/Users/types'
import api from '~src/services/api'

export const useUpdateUserProfile = () => {
  const client = useQueryClient()
  return useMutation<UserProfile, Error, EditProfileFormData>({
    mutationFn: (data) => api.users.updateProfile(data),
    mutationKey: ['updateProfile'],
    // Invalidate profile query after mutation
    onSuccess: async (data) => {
      await client.invalidateQueries({ queryKey: ['currentUser'] })
      return data
    },
  })
}

// Query to get a user information
export const useUserProfile = (userId: string, options?: Omit<UseQueryOptions<UserProfile>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => api.users.getById(userId),
    ...options,
  })
