export interface UserProfile {
  id: string
  name: string
  email: string
  avatarHash?: string
  bio?: string
  rating: number
  ratingCount: number
  createdAt: string
  updatedAt: string
  location?: {
    latitude: number
    longitude: number
  }
  active: boolean
}

export interface Image {
  hash: string
  name: string
}

export interface ImageContent extends Image {
  content: string
}

export interface DateRange {
  from: number
  to: number
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
  reservedDates: DateRange[] | null
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Booking {
  id: string
  toolId: string
  fromUserId: string
  toUserId: string
  startDate: number
  endDate: number
  contact?: string
  comments?: string
  bookingStatus: BookingStatus
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

export interface EditProfileFormData {
  name: string
  email: string
  password?: string
  confirmPassword?: string
  location?: { latitude: number; longitude: number }
  active: boolean
  avatar?: string // b64 string
}

export interface EditProfileFormProps {
  initialData: {
    name: string
    email: string
    location?: { latitude: number; longitude: number }
    active: boolean
    avatarHash?: string
  }
  onSuccess?: () => void
}
