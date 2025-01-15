import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { RateSubmission } from './types'

export const useGetPendingRatings = () => {
  return useQuery({
    queryKey: ['pendingRatings'],
    queryFn: () => api.bookings.getRatings(),
  })
}

export const useSubmitRating = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RateSubmission) => api.bookings.submitRating(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRatings'] })
    },
  })
}
