// export interface Rating extends Booking {}
export interface Rating {
  id: string
  bookingId: string
  fromUserId: string
  toUserId: string
  rating: number
  ratingComment: string
  ratingHashImages: string[]
  ratedAt: string
}

export interface BookingRating {
  id: string
  bookingId: string
  fromUserId: string
  toUserId: string
  rating: number
  comment: string
  images?: string[]
  ratedAt: number
}

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
  owner: RatingParty
  requester: RatingParty
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
