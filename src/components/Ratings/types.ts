import { Booking } from '~components/Bookings/queries'

export type Rating = {} & Booking

export interface RateSubmission {
  bookingId: string
  rating: number
  comment: string
}
