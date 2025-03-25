import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '~src/services/api'
import { CommunityFormData, CreateCommunityParams, UpdateCommunityParams } from './types'
import { useUploadImage, useUploadImages } from '~components/Images/queries'

export const CommunityKeys = {
  all: ['communities'],
  detail: (id: string) => ['communities', id],
  users: (id: string) => ['communities', id, 'users'],
  invites: ['communities', 'invites'],
  userCommunities: (userId: string) => ['communities', 'user', userId],
}

// Get all communities the current user belongs to
export const useCommunities = () => {
  return useQuery({
    queryKey: CommunityKeys.all,
    queryFn: () => api.communities.getCommunities(),
  })
}

// Get a specific community's details
export const useCommunityDetail = (id: string) => {
  return useQuery({
    queryKey: CommunityKeys.detail(id),
    queryFn: () => api.communities.getCommunityById(id),
    enabled: !!id,
  })
}

// Get users in a community
export const useCommunityUsers = (id: string) => {
  return useQuery({
    queryKey: CommunityKeys.users(id),
    queryFn: () => api.communities.getCommunityUsers(id),
    enabled: !!id,
  })
}

// Get pending invites for the current user
export const useCommunityInvites = () => {
  return useQuery({
    queryKey: CommunityKeys.invites,
    queryFn: () => api.communities.getInvites(),
  })
}

// Create a new community
export const useCreateCommunity = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: uploadImage } = useUploadImage()

  return useMutation({
    mutationFn: async (data: CommunityFormData) => {
      const params: CreateCommunityParams = {
        name: data.name,
      }

      if (data.image) {
        // Upload the image and get the hash
        params.imageHash = (await uploadImage(data.image, {})).hash
      }
      return api.communities.createCommunity(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CommunityKeys.all })
    },
  })
}

// Update a community
export const useUpdateCommunity = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: uploadImage } = useUploadImage()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CommunityFormData }) => {
      const params: UpdateCommunityParams = {
        id,
        name: data.name,
      }

      if (data.image) {
        // Upload the image and get the hash
        params.imageHash = (await uploadImage(data.image, {})).hash
      }

      return api.communities.updateCommunity(params)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CommunityKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: CommunityKeys.all })
    },
  })
}

// Delete a community
export const useDeleteCommunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.communities.deleteCommunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CommunityKeys.all })
    },
  })
}

// Invite a user to a community
export const useInviteUserToCommunity = () => {
  return useMutation({
    mutationFn: ({ communityId, userId }: { communityId: string; userId: string }) =>
      api.communities.inviteUser(communityId, userId),
  })
}

// Leave a community
export const useLeaveCommunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (communityId: string) => api.communities.leaveCommunity(communityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CommunityKeys.all })
    },
  })
}

// Accept a community invite
export const useAcceptInvite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteId: string) => api.communities.acceptInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CommunityKeys.invites })
      queryClient.invalidateQueries({ queryKey: CommunityKeys.all })
    },
  })
}

// Refuse a community invite
export const useRefuseInvite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteId: string) => api.communities.refuseInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CommunityKeys.invites })
    },
  })
}

// Get communities for a specific user
export const useUserCommunities = (userId: string) => {
  return useQuery({
    queryKey: CommunityKeys.userCommunities(userId),
    queryFn: () => api.communities.getUserCommunities(userId),
    enabled: !!userId,
  })
}
