export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  rating: number
  ratingCount: number
  createdAt: string
  updatedAt: string
}

export interface Image {
  hash: string
  name: string
}

export interface ImageContent extends Image {
  content: string
}

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
  reservedDates: any | null // todo(konv1) Replace `any` with the actual type if known
}

export interface Booking {
  id: string
  tool: Tool
  user: UserProfile
  startDate: string
  endDate: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface Rating {
  id: string
  rating: number
  comment: string
  tool: Tool
  user: UserProfile
  booking: Booking
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  startDate?: string
  endDate?: string
  lat?: number
  lng?: number
  radius?: number
}
