import { Image } from '~components/Images/ServerImage'
import { DateRange } from '~components/Layout/Form/DateRangePicker'

export interface Tool {
  id: number
  title: string
  description: string
  isAvailable: boolean
  mayBeFree: boolean
  askWithFee: boolean
  cost: number
  userId: string
  images: Image[]
  transportOptions: any | null // todo(konv1) Replace `any` with the actual type if known
  toolCategory: number
  location: {
    latitude: number
    longitude: number
  }
  rating: number
  estimatedValue: number
  height: number
  weight: number
  reservedDates: DateRange[] | null
}

// Additional tool-specific types
export interface ToolFormData {
  name: string
  description: string
  price: number
  category: string
  location: string
  images: File[]
  availability: {
    start: string
    end: string
  }
}

export interface ToolSearchParams {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  radius?: number
  startDate?: string
  endDate?: string
  sortBy?: 'price' | 'distance' | 'rating'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ToolFilterState {
  category: string
  priceRange: [number, number]
  location: string
  radius: number
  dateRange: [Date | null, Date | null]
  sortBy: string
  sortOrder: 'asc' | 'desc'
}
