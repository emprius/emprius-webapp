import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import api from '../../services/api'
import { RatingFormData, type UnifiedRating } from './types'
import { BookingKeys } from '~components/Bookings/queries'
import { useUploadImages } from '~components/Images/queries'
import { useAuth } from '~components/Auth/AuthContext'
import { PendingActionsKeys } from '~components/Layout/Contexts/PendingActionsProvider'
import { QueryKey } from '@tanstack/react-query/build/modern/index'
import { useRoutedPagination } from '~components/Layout/Pagination/PaginationProvider'
import { ToolsKeys } from '~components/Tools/queries'
import { UserKeys } from '~components/Users/queries'

export const RatingsKeys = {
  ratingsLists: ['ratings'] as const,
  pending: (page?: number): QueryKey => ['ratings', 'pending', page] as const,
  allPendings: ['ratings', 'pending'] as const,
  bookingRatings: (bookingId: string) => ['ratings', 'booking', bookingId] as const,
  submitted: ['ratings', 'submitted'] as const,
  received: ['ratings', 'received'] as const,
  submit: (id: string) => ['ratings', 'submit', id] as const,
}

export const useGetPendingRatings = () => {
  const { page } = useRoutedPagination()
  return useQuery({
    queryKey: RatingsKeys.pending(page),
    queryFn: () => api.bookings.getPendingRatings({ page }),
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
  const { page } = useRoutedPagination()

  return useQuery({
    queryKey: UserKeys.userRatings(id, page),
    queryFn: () => api.users.getUserRatings(id, { page }),
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
        queryKey: UserKeys.userRatings(user.id, 0), // Reset to first page after submission
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

export const useToolRatings = (id: string) => {
  const { page } = useRoutedPagination()
  return useQuery({
    queryKey: ToolsKeys.toolRatings(id, page),
    queryFn: () => api.tools.getRatings(id, { page }),
    enabled: !!id,
  })
}
