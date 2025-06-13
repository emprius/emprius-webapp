import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '~src/services/api'
import { CommunityFormData, CreateCommunityParams, UpdateCommunityParams } from './types'
import { useUploadImage, useUploadImages } from '~components/Images/queries'
import { useAuth } from '~components/Auth/AuthContext'
import { PendingActionsKeys } from '~components/Layout/Contexts/PendingActionsProvider'
import { useRoutedPagination } from '~components/Layout/Pagination/PaginationProvider'
import { useDebouncedSearch } from '~components/Layout/Search/DebouncedSearchContext'

export const CommunityKeys = {
  user: (id: string, page?: number, term?: string) => ['communities', 'user', id, page, term],
  userSearch: (id: string, term?: string) => ['communities', 'user', id, 'search', term],
  detail: (id: string) => ['communities', id],
  members: (id: string, page?: number, term?: string) => ['communities', id, 'members', page, term],
  tools: (id: string, page?: number, term?: string) => ['communities', id, 'tools', page, term],
  invites: ['communities', 'invites'],
}

// Get all communities the current user belongs to specific user
export const useUserCommunities = (userId: string) => {
  const { page } = useRoutedPagination()
  const { debouncedSearch: term } = useDebouncedSearch()
  return useQuery({
    queryKey: CommunityKeys.user(userId, page, term),
    queryFn: () => api.users.getUserCommunities(userId, { page, term }),
    enabled: !!userId,
  })
}

// Get all communities the current user belongs to specific user
export const useDefaultUserCommunities = () => {
  const {
    user: { id },
  } = useAuth()
  return useUserCommunities(id)
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
  const { debouncedSearch: term } = useDebouncedSearch()
  const { page } = useRoutedPagination()
  return useQuery({
    queryKey: CommunityKeys.members(id, page, term),
    queryFn: () => api.communities.getCommunityMembers(id, { page, term }),
    enabled: !!id,
  })
}

// Get tools in a community
export const useCommunityTools = (id: string) => {
  const { debouncedSearch: term } = useDebouncedSearch()
  const { page } = useRoutedPagination()
  return useQuery({
    queryKey: CommunityKeys.tools(id, page, term),
    queryFn: () => api.communities.getCommunityTools(id, { page, term }),
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
  const {
    user: { id },
  } = useAuth()

  return useMutation({
    mutationFn: async (data: CommunityFormData) => {
      const params: CreateCommunityParams = {
        name: data.name,
      }

      if (data.image) {
        // Upload the image and get the hash
        params.image = (await uploadImage(data.image, {})).hash
      }
      return api.communities.createCommunity(params)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CommunityKeys.user(id) })
    },
  })
}

// Update a community
export const useUpdateCommunity = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: uploadImage } = useUploadImage()
  const {
    user: { id },
  } = useAuth()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CommunityFormData }) => {
      const params: UpdateCommunityParams = {
        id,
        name: data.name,
      }

      if (data.image) {
        // Upload the image and get the hash
        params.image = (await uploadImage(data.image, {})).hash
      }

      return api.communities.updateCommunity(id, params)
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: CommunityKeys.detail(variables.id) })
      await queryClient.invalidateQueries({ queryKey: CommunityKeys.user(id) })
    },
  })
}

// Delete a community
export const useDeleteCommunity = () => {
  const queryClient = useQueryClient()
  const {
    user: { id },
  } = useAuth()

  return useMutation({
    mutationFn: (id: string) => api.communities.deleteCommunity(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CommunityKeys.user(id) })
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
  const {
    user: { id },
  } = useAuth()

  return useMutation({
    mutationFn: (communityId: string) => api.communities.leaveCommunity(communityId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CommunityKeys.user(id) })
    },
  })
}

// Accept a community invite
export const useAcceptCommunityInvite = () => {
  const queryClient = useQueryClient()
  const {
    user: { id },
  } = useAuth()

  return useMutation({
    mutationFn: (inviteId: string) => api.communities.updateInvite(inviteId, 'ACCEPTED'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CommunityKeys.invites })
      await queryClient.invalidateQueries({ queryKey: CommunityKeys.user(id) })
      await queryClient.invalidateQueries({ queryKey: PendingActionsKeys })
    },
  })
}

// Refuse a community invite
export const useRefuseCommunityInvite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteId: string) => api.communities.updateInvite(inviteId, 'REJECTED'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CommunityKeys.invites })
      await queryClient.invalidateQueries({ queryKey: PendingActionsKeys })
    },
  })
}

// Refuse a community invite
export const useRemoveCommunityUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ communityId, userId }: { communityId: string; userId: string }) =>
      api.communities.removeUser(communityId, userId),
    onSuccess: (res, { communityId }) => {
      queryClient.invalidateQueries({ queryKey: CommunityKeys.detail(communityId) })
    },
  })
}

export const useCancelCommunityInvite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteId: string) => api.communities.updateInvite(inviteId, 'CANCELED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CommunityKeys.invites })
    },
  })
}
