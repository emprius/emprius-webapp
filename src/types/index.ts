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

export interface Tool {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  status: 'available' | 'unavailable' | 'booked'
  location: {
    address: string
    lat: number
    lng: number
  }
  owner: {
    id: string
    name: string
    avatar?: string
    rating: number
  }
  availability: {
    start: string
    end: string
  }
  createdAt: string
  updatedAt: string
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
