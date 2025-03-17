import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { RatingFormData, UnifiedRating } from './types'
import { BookingKeys } from '~components/Bookings/queries'
import { useUploadImages } from '~components/Images/queries'
import { useAuth } from '~components/Auth/AuthContext'

export const RatingsKeys = {
  ratingsLists: ['ratings'] as const,
  pending: ['ratings', 'pending'] as const,
  userRatings: (userId: string) => ['ratings', 'user', userId] as const,
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

export const useGetUserRatings = (userId?: string) => {
  const { user } = useAuth()
  const id = userId || user.id
  
  return useQuery({
    queryKey: RatingsKeys.userRatings(id),
    queryFn: () => api.users.getUserRatings(id),
    enabled: !!id,
  })
}

// Filter unified ratings to get only those submitted by the current user
export const useGetSubmittedRatings = () => {
  const { user } = useAuth()
  const { data, ...rest } = useGetUserRatings(user.id)
  
  const submittedRatings = data?.filter(rating => {
    // If the user is the owner, check if owner has rated
    if (rating.owner.id === user.id) {
      return rating.owner.rating !== null
    }
    // If the user is the requester, check if requester has rated
    if (rating.requester.id === user.id) {
      return rating.requester.rating !== null
    }
    return false
  }).map(rating => {
    // Convert to the old Rating format for backward compatibility
    const isOwner = rating.owner.id === user.id
    const ratingParty = isOwner ? rating.owner : rating.requester
    const toUserId = isOwner ? rating.requester.id : rating.owner.id
    
    return {
      id: rating.id,
      bookingId: rating.bookingId,
      fromUserId: user.id,
      toUserId,
      rating: ratingParty.rating || 0,
      ratingComment: ratingParty.ratingComment || '',
      ratingHashImages: ratingParty.images || [],
      ratedAt: ratingParty.ratedAt ? new Date(ratingParty.ratedAt * 1000).toISOString() : '',
    }
  })
  
  return {
    ...rest,
    data: submittedRatings || [],
  }
}

// Filter unified ratings to get only those received by the current user
export const useGetReceivedRatings = () => {
  const { user } = useAuth()
  const { data, ...rest } = useGetUserRatings(user.id)
  
  const receivedRatings = data?.filter(rating => {
    // If the user is the owner, check if requester has rated
    if (rating.owner.id === user.id) {
      return rating.requester.rating !== null
    }
    // If the user is the requester, check if owner has rated
    if (rating.requester.id === user.id) {
      return rating.owner.rating !== null
    }
    return false
  }).map(rating => {
    // Convert to the old Rating format for backward compatibility
    const isOwner = rating.owner.id === user.id
    const fromUserId = isOwner ? rating.requester.id : rating.owner.id
    const ratingParty = isOwner ? rating.requester : rating.owner
    
    return {
      id: rating.id,
      bookingId: rating.bookingId,
      fromUserId,
      toUserId: user.id,
      rating: ratingParty.rating || 0,
      ratingComment: ratingParty.ratingComment || '',
      ratingHashImages: ratingParty.images || [],
      ratedAt: ratingParty.ratedAt ? new Date(ratingParty.ratedAt * 1000).toISOString() : '',
    }
  })
  
  return {
    ...rest,
    data: receivedRatings || [],
  }
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
    },
    retry: false,
    ...options,
  })
}
