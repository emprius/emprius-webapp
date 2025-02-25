import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { RateSubmission } from './types'
import { BookingKeys } from '~components/Bookings/queries'

export const RatingsKeys = {
  ratingsLists: ['ratings'],
  pending: ['ratings', 'pending'],
  submitted: ['ratings', 'submitted'],
  received: ['ratings', 'received'],
}

export const useGetPendingRatings = () => {
  return useQuery({
    queryKey: RatingsKeys.pending,
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

export const useSubmitRating = ({ bookingId }: { bookingId: string }) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RateSubmission) => api.bookings.submitRating(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: RatingsKeys.ratingsLists })
      await queryClient.invalidateQueries({ queryKey: BookingKeys.bookingsLists })
      await queryClient.invalidateQueries({ queryKey: BookingKeys.detail(bookingId) })
    },
  })
}
