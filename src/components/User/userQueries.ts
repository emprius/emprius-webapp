import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EditProfileFormData, UserProfile } from '~components/User/userTypes'
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
export const useUserProfile = (userId: string) =>
  useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => api.users.getById(userId),
  })
