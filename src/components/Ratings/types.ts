import { Booking } from '~components/Bookings/queries'

export interface Rating extends Booking {}

export interface RateSubmission {
  bookingId: string
  rating: number
  comment: string
}
