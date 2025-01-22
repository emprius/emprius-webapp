import { Booking } from '~components/Bookings/bookingsQueries'

export type Rating = {} & Booking

export interface RateSubmission {
  bookingId: string
  rating: number
  comment: string
}
