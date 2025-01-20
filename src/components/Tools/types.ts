import { Image } from '~components/Images/ServerImage'
import { DateRange } from '~components/Layout/Form/DateRangePicker'
import { EmpriusLocation } from '~components/Layout/types'
import { Transport } from '~components/Auth/infoTypes'

export interface Tool {
  id: number
  title: string
  description?: string
  isAvailable?: boolean
  mayBeFree: boolean
  askWithFee: boolean
  cost?: number
  userId: string
  images: Image[]
  transportOptions?: Transport[] // Array of transport IDs
  toolCategory?: number // Category ID
  location?: EmpriusLocation
  rating: number
  estimatedValue?: number
  height?: number
  weight?: number
  reservedDates: DateRange[] | null
}

// todo(konv1): Confirm below is not used anywhere
// Additional tool-specific types
// export interface ToolFormData {
//   name: string
//   description: string
//   price: number
//   category: string
//   location: string
//   images: File[]
//   availability: {
//     start: string
//     end: string
//   }
// }
//
// export interface ToolSearchParams {
//   query?: string
//   category?: string
//   minPrice?: number
//   maxPrice?: number
//   location?: string
//   radius?: number
//   startDate?: string
//   endDate?: string
//   sortBy?: 'price' | 'distance' | 'rating'
//   sortOrder?: 'asc' | 'desc'
//   page?: number
//   limit?: number
// }
//
// export interface ToolFilterState {
//   category: string
//   priceRange: [number, number]
//   location: string
//   radius: number
//   dateRange: [Date | null, Date | null]
//   sortBy: string
//   sortOrder: 'asc' | 'desc'
// }
