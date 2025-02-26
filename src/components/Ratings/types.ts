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

export interface RateSubmission {
  bookingId: string
  rating: number
  comment: string
  images?: string[]
}
