export interface RatingParty {
  id: string
  rating: number | null
  ratingComment: string | null
  ratedAt: number | null
  images: string[] | null
}

export interface UnifiedRating {
  id: string
  bookingId: string
  toolId: string
  owner: RatingParty
  requester: RatingParty
}

export type UnifiedRatingsResponse = {
  ratings: UnifiedRating[]
}

export interface RateSubmission {
  bookingId: string
  rating: number
  comment: string
  images?: string[]
}

export interface RatingFormData {
  userRating: number
  comment: string
  images?: FileList
}
