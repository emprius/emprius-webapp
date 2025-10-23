import { EmpriusLocation } from '~components/Layout/Map/types'
import { LatLng } from 'leaflet'

export type UserPreview = {
  id: string
  name: string
  avatarHash?: string
  ratingCount: number
  active: boolean
  rating: number
  karma: number
}

export type UserProfile = UserPreview & {
  email: string
  location?: LatLng
  tokens: number
  community?: string
  createdAt: string
  lastSeen: string
  bio?: string
  communities?: {
    id: string
    role: 'owner' | 'user'
  }[]
  additionalContacts?: AdditionalContacts
}

export type UserProfileDTO = Omit<UserProfile, 'location' | 'inviteCodes'> & {
  location?: EmpriusLocation
}

export type Invite = {
  code: string
  createdOn: Date
}

type InviteDTO = Omit<Invite, 'createdOn'> & { createdOn: string }

export type AdditionalContacts = Record<string, string>

export type NotificationPreferenceType =
  | 'incoming_requests'
  | 'booking_accepted'
  | 'tool_holder_changed'
  | 'community_messages'
  | 'daily_message_digest'
  | 'general_forum_messages'
  | 'private_messages'
export type NotificationPreferences = Map<NotificationPreferenceType, boolean>

type ProfilePrivateData = {
  inviteCodes?: Invite[]
  notificationPreferences?: NotificationPreferences
  lang?: string
}

export type OwnUserProfile = UserProfile & ProfilePrivateData

export type OwnUserProfileDTO = UserProfileDTO &
  Omit<ProfilePrivateData, 'inviteCodes'> & {
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
  additionalContacts?: AdditionalContacts
  lang?: string
}

export type EditProfileFormDataDTO = Omit<UserProfileDTO, 'location'> & {
  location?: EmpriusLocation
}

export type GetUsersDTO = { users: UserProfileDTO[] }
export type GetUsers = { users: UserProfile[] }
export type ToolHistoryEntry = {
  id: string
  userId: string
  userName: string
  pickupDate: Date
  location: LatLng
  bookingId: string
}
export type ToolHistoryEntryDTO = Omit<ToolHistoryEntry, 'location' | 'pickupDate'> & {
  location: EmpriusLocation
  pickupDate: number
}
// The API returns an array of these
export type ToolHistoryResponse = ToolHistoryEntryDTO[]
