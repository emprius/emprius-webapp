import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { RatingFormData } from './types'
import { BookingKeys } from '~components/Bookings/queries'
import { useUploadImages } from '~components/Images/queries'

export const RatingsKeys = {
  ratingsLists: ['ratings'] as const,
  pending: ['ratings', 'pending'] as const,
  submitted: ['ratings', 'submitted'] as const,
  received: ['ratings', 'received'] as const,
  submit: (id: string) => ['ratings', 'submit', id] as const,
}

export const useGetPendingRatings = () => {
  return useQuery({
    queryKey: ['ratings', 'pending'],
    queryFn: () => api.bookings.getRatings(),
  })
}

export const useGetSubmittedRatings = () => {
  return useQuery({
    queryKey: RatingsKeys.submitted,
    queryFn: () => api.bookings.getSubmittedRatings(),
  })
}

export const useGetReceivedRatings = () => {
  return useQuery({
    queryKey: RatingsKeys.received,
    queryFn: () => api.bookings.getReceivedRatings(),
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
      await queryClient.invalidateQueries({
        queryKey: RatingsKeys.ratingsLists || BookingKeys.bookingsLists || BookingKeys.detail(bookingId),
      })
    },
    retry: false,
    ...options,
  })
}
