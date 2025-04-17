import { EmpriusLocation } from '~components/Layout/Map/types'
import { LatLng } from 'leaflet'

export type UserProfile = {
  id: string
  name: string
  email: string
  avatarHash?: string
  rating: number
  location?: LatLng
  active: boolean
  tokens: number
  community?: string
  // notExists
  // ratingCount: number
  // createdAt: string
  // updatedAt: string
  // bio?: string
}

export type UserProfileDTO = Omit<UserProfile, 'location'> & {
  location?: EmpriusLocation
}

export type EditProfileFormData = {
  name: string
  actualPassword?: string
  password?: string
  confirmPassword?: string
  location?: LatLng
  active: boolean
  avatar?: string // b64 string
  community?: string
}

export type EditProfileFormDataDTO = Omit<UserProfileDTO, 'location'> & {
  location?: EmpriusLocation
}

export type GetUsersDTO = { users: UserProfileDTO[] }
export type GetUsers = { users: UserProfile[] }
