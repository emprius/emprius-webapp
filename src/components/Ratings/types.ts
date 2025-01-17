import { Image } from '~components/Images/ServerImage'
import { DateRange } from '~components/Layout/Form/DateRangePicker'

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
  bookingId: string
  rating: number
  ratingType: 'USER' | 'TOOL'
}
