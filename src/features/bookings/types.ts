import { DateRange, Image } from '../../types'

export interface Rating {
  id: number
  isPending: boolean
  fromUserId: number
  toUserId: number
  bookingId: number
  thumbnail: Image
  title: string
  rating: number | null
  reservedDates: DateRange
  ratingType: 'USER' | 'TOOL'
}

export interface RateSubmission {
  bookingId: number
  rating: number
  ratingType: 'USER' | 'TOOL'
}
