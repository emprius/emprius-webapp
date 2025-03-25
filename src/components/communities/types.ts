import { UserProfile } from '~components/Users/types'

export type CommunityRole = 'owner' | 'user'

export interface CommunityMember {
  id: string
  role: CommunityRole
}

export interface Community {
  id: string
  name: string
  imageHash?: string
  members: CommunityMember[]
}

export interface CommunityResponse {
  communities: Community[]
}

export interface CommunityDetailResponse {
  id: string
  name: string
  imageHash?: string
  members: CommunityMember[]
}

export interface CommunityUsersResponse {
  users: UserProfile[]
}

export interface CommunityInvite {
  id: string
  communityId: string
  communityName: string
  imageHash?: string
  invitedBy: string
  createdAt: string
}

export interface CommunityInvitesResponse {
  invites: CommunityInvite[]
}

export interface CreateCommunityParams {
  name: string
  imageHash?: string
}

export interface UpdateCommunityParams {
  id: string
  name?: string
  imageHash?: string
}

export interface CommunityFormData {
  name: string
  image?: File | null
}
