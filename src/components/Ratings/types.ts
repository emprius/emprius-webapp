import { Booking } from '~components/Bookings/queries'

export interface Rating extends Booking {
  isRated: boolean
  rating?: number
  ratingComment?: string
}

export interface RateSubmission {
  bookingId: string
  rating: number
  comment: string
}
