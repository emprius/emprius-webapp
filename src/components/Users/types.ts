import { EmpriusLocation } from '~components/Layout/Map/types'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarHash?: string
  rating: number
  location?: EmpriusLocation
  active: boolean
  tokens: number
  community?: string
  // notExists
  // ratingCount: number
  // createdAt: string
  // updatedAt: string
  // bio?: string
}

export interface EditProfileFormData {
  name: string
  actualPassword?: string
  password?: string
  confirmPassword?: string
  location?: EmpriusLocation
  active: boolean
  avatar?: string // b64 string
  community?: string
}

export interface EditProfileFormProps {
  initialData: {
    name: string
    location?: EmpriusLocation
    active: boolean
    avatarHash?: string
    community?: string
  }
}
