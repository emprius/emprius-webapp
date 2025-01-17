import { EmpriusLocation } from '~components/Layout/types'

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
  location?: EmpriusLocation
  active: boolean
}

export interface EditProfileFormData {
  name: string
  email: string
  password?: string
  confirmPassword?: string
  location?: EmpriusLocation
  active: boolean
  avatar?: string // b64 string
}

export interface EditProfileFormProps {
  initialData: {
    name: string
    email: string
    location?: EmpriusLocation
    active: boolean
    avatarHash?: string
  }
  onSuccess?: () => void
}
