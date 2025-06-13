import { UserPreview } from '~components/Users/types'

export type CommunityRole = 'owner' | 'user'

export interface Community {
  id: string
  name: string
  ownerId: string
  image?: string
  membersCount: number
  toolsCount: number
}

export type CommunitiesListResponse = {
  communities: Community[]
}

export type CommunityUsersResponse = {
  users: Array<
    UserPreview & {
      role: CommunityRole
    }
  >
}

export interface CommunityInvite {
  id: string
  communityId: string
  userId: string
  inviterId: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
  community: {
    name: string
    image: string
  }
}

export type CommunityInvitesResponse = CommunityInvite[]

export interface CreateCommunityParams {
  name: string
  image?: string
}

export type UpdateCommunityParams = {
  id: string
} & Partial<CreateCommunityParams>

export interface CommunityFormData {
  name: string
  image?: File | null
}
