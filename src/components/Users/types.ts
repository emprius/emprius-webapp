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
  ratingCount: number
  createdAt: string
  lastSeen: string
  bio?: string
  communities?: {
    id: string
    role: 'owner' | 'user'
  }[]
}

export type UserProfileDTO = Omit<UserProfile, 'location' | 'inviteCodes'> & {
  location?: EmpriusLocation
}

export type Invite = {
  code: string
  createdOn: Date
}

type InviteDTO = Omit<Invite, 'createdOn'> & { createdOn: string }

export type OwnUserProfile = UserProfile & {
  inviteCodes?: Invite[]
}

export type OwnUserProfileDTO = UserProfileDTO & {
  inviteCodes?: InviteDTO[]
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
  bio?: string
}

export type EditProfileFormDataDTO = Omit<UserProfileDTO, 'location'> & {
  location?: EmpriusLocation
}

export type GetUsersDTO = { users: UserProfileDTO[] }
export type GetUsers = { users: UserProfile[] }
