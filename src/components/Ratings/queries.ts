import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { RateSubmission } from './types'

export const useGetPendingRatings = () => {
  return useQuery({
    queryKey: ['pendingRatings'],
    queryFn: () => api.bookings.getRatings(),
  })
}

export const useGetSubmittedRatings = () => {
  return useQuery({
    queryKey: ['submittedRatings'],
    queryFn: () => api.bookings.getSubmittedRatings(),
  })
}

export const useGetReceivedRatings = () => {
  return useQuery({
    queryKey: ['receivedRatings'],
    queryFn: () => api.bookings.getReceivedRatings(),
  })
}

export const useSubmitRating = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RateSubmission) => api.bookings.submitRating(data),
    onSuccess: () => {
      // Invalidate all rating-related queries
      queryClient.invalidateQueries({ queryKey: ['pendingRatings'] })
      queryClient.invalidateQueries({ queryKey: ['submittedRatings'] })
      queryClient.invalidateQueries({ queryKey: ['receivedRatings'] })
    },
  })
}
