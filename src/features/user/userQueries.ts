import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import api from '~src/services/api'
import { Booking, EditProfileFormData, UserProfile } from '~src/types'

export const useUserTools = () =>
  useQuery({
    queryKey: ['userTools'],
    queryFn: () => api.tools.getUserTools(),
  })

export const useBookingRequests = (options?: Omit<UseQueryOptions<Booking[]>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: ['bookingRequests'],
    queryFn: () => api.bookings.getRequests(),
    ...options,
  })

export const useBookingPetitions = (options?: Omit<UseQueryOptions<Booking[]>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: ['bookingPetitions'],
    queryFn: () => api.bookings.getPetitions(),
    ...options,
  })

export const useUpdateBookingStatus = () => {
  const client = useQueryClient()
  return useMutation<Booking, Error, { bookingId: string; status: 'confirmed' | 'cancelled' }>({
    mutationFn: ({ bookingId, status }) => api.bookings.updateStatus(bookingId, status),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['bookingRequests'] })
      client.invalidateQueries({ queryKey: ['bookingPetitions'] })
    },
  })
}

export const useUpdateUserProfile = () => {
  const client = useQueryClient()
  return useMutation<UserProfile, Error, EditProfileFormData>({
    mutationFn: (data) => api.users.updateProfile(data),
    mutationKey: ['updateProfile'],
    // Invalidate profile query after mutation
    onMutate: async (data) => {
      await client.invalidateQueries({ queryKey: ['currentUser'] })
      return data
    },
  })
}

// Query to get a user information
export const useUserProfile = (userId: string) =>
  useQuery({
    queryKey: ['userProfile', userId],
    // todo(konv1): this is a mock
    queryFn: () => api.auth.getCurrentUser(),
    // queryFn: () => api.users.getById(userId),
  })
