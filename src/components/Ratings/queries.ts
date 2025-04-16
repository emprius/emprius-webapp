import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import api from '../../services/api'
import { RatingFormData, type UnifiedRating } from './types'
import { BookingKeys } from '~components/Bookings/queries'
import { useUploadImages } from '~components/Images/queries'
import { useAuth } from '~components/Auth/AuthContext'
import { PendingActionsKeys } from '~components/Layout/Contexts/PendingActionsProvider'

export const RatingsKeys = {
  ratingsLists: ['ratings'] as const,
  pending: ['ratings', 'pending'] as const,
  userRatings: (userId: string) => ['ratings', 'user', userId] as const,
  bookingRatings: (bookingId: string) => ['ratings', 'booking', bookingId] as const,
  submitted: ['ratings', 'submitted'] as const,
  received: ['ratings', 'received'] as const,
  submit: (id: string) => ['ratings', 'submit', id] as const,
}

export const useGetPendingRatings = () => {
  return useQuery({
    queryKey: RatingsKeys.pending,
    queryFn: () => api.bookings.getPendingRatings(),
  })
}

// Hook to get ratings for a specific booking
export const useGetBookingRatings = (
  bookingId: string,
  options?: Omit<UseQueryOptions<UnifiedRating>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: RatingsKeys.bookingRatings(bookingId),
    queryFn: async () => await api.bookings.getBookingRatings(bookingId),
    enabled: !!bookingId,
    ...options,
  })
}

export const useGetUserRatings = (userId?: string) => {
  const { user } = useAuth()
  const id = userId || user.id

  return useQuery({
    queryKey: RatingsKeys.userRatings(id),
    queryFn: () => api.users.getUserRatings(id),
    enabled: !!id,
  })
}

export const useSubmitRating = ({
  bookingId,
  ...options
}: {
  bookingId: string
} & Omit<UseMutationOptions<void, Error, RatingFormData>, 'mutationKey' | 'mutationFn' | 'onSuccess'>) => {
  const queryClient = useQueryClient()
  const { mutateAsync: uploadImages } = useUploadImages()
  const { user } = useAuth()

  return useMutation({
    mutationKey: RatingsKeys.submit(bookingId),
    mutationFn: async (data: RatingFormData) => {
      // Upload images if any
      let imageHashes: string[] = []
      if (data.images && data.images.length > 0) {
        imageHashes = await uploadImages(data.images)
      }
      return api.bookings.submitRating({
        bookingId: bookingId,
        rating: data.userRating,
        comment: data.comment,
        images: imageHashes.length > 0 ? imageHashes : undefined,
      })
    },
    onSuccess: async () => {
      // Invalidate both old and new query keys for compatibility
      await queryClient.invalidateQueries({
        queryKey: RatingsKeys.ratingsLists,
      })
      await queryClient.invalidateQueries({
        queryKey: RatingsKeys.userRatings(user.id),
      })
      await queryClient.invalidateQueries({
        queryKey: BookingKeys.bookingsLists,
      })
      await queryClient.invalidateQueries({
        queryKey: BookingKeys.detail(bookingId),
      })
      await queryClient.invalidateQueries({
        queryKey: PendingActionsKeys,
      })
    },
    retry: false,
    ...options,
  })
}
