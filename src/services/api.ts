import axios, {AxiosError, AxiosResponse} from 'axios'
import {ILoginParams, IRegisterParams, LoginResponse} from '~components/Auth/queries'
import {Booking, BookingActionsParams, BookingActionsReturnType, CreateBookingData,} from '~components/Bookings/queries'
import {InfoData} from '~components/Layout/Contexts/InfoContext'
import {BookingPendings} from '~components/Layout/Contexts/PendingActionsProvider'
import type {BookingRating, RateSubmission, Rating, UnifiedRating} from '~components/Ratings/types'
import {SearchParams} from '~components/Search/queries'
import {createToolParams, UpdateToolParams} from '~components/Tools/queries'
import {Tool, ToolsListResponse} from '~components/Tools/types'
import {EditProfileFormData, UserProfile} from '~components/Users/types'
import {STORAGE_KEYS} from '~utils/constants'
import {ImageUploadResponse} from '~components/Images/queries'
import {
  Community,
  CommunityDetailResponse,
  CommunityInvitesResponse,
  CommunityResponse,
  CommunityUsersResponse,
  CreateCommunityParams,
  UpdateCommunityParams
} from '~components/communities/types'

// Exception to throw when an API return 401
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ? message : 'user not authorized')
    this.name = 'UnauthorizedError'
  }
}

export class ApiError extends Error {
  public raw: AxiosError

  constructor(message?: string, error?: AxiosError) {
    super(message ? message : 'api error')
    this.name = 'ApiError'
    this.raw = error
  }
}

interface ApiResponseHeader {
  success: boolean
  message: string
}

export interface ApiResponse<T> {
  data?: T
  header: ApiResponseHeader
}

const api = axios.create({
  baseURL: import.meta.env.API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => response,
  async (error: AxiosError<ApiResponse<any>>) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      throw new UnauthorizedError(error?.message)
    }
    if (!axios.isAxiosError(error)) throw error
    const err = error?.response?.data?.header
    if (!err?.success) {
      if (!err?.message) throw new ApiError(error.message, error)
      throw new ApiError(err?.message, error)
    }
    throw error
  }
)

async function apiRequest<T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<T> {
  const { data } = await promise
  if (data?.header?.success) {
    return data.data
  }
  throw new ApiError(data?.header?.message || 'API success is not true')
}

// Auth endpoints
export const auth = {
  login: (data: ILoginParams) => apiRequest(api.post<ApiResponse<LoginResponse>>('/login', data)),
  register: (data: IRegisterParams) => apiRequest(api.post<ApiResponse<LoginResponse>>('/register', data)),
  getCurrentUser: () => apiRequest(api.get<ApiResponse<UserProfile>>('/profile')),
}

// Tools endpoints
export const tools = {
  getUserTools: () => apiRequest(api.get<ApiResponse<ToolsListResponse>>('/tools')),
  getUserToolsById: (userId: string) => apiRequest(api.get<ApiResponse<ToolsListResponse>>(`/tools/user/${userId}`)),
  searchTools: (params: SearchParams) =>
    apiRequest(api.get<ApiResponse<ToolsListResponse>>('/tools/search', { params })),
  getById: (id: string) => apiRequest(api.get<ApiResponse<Tool>>(`/tools/${id}`)),
  create: (data: createToolParams) =>
    apiRequest(
      api.post<ApiResponse<Tool>>('/tools', {
        ...data,
      })
    ),
  update: ({ id, ...data }: UpdateToolParams) => apiRequest(api.put<ApiResponse<Tool>>(`/tools/${id}`, data)),
  delete: (id: string) => apiRequest(api.delete<ApiResponse<void>>(`/tools/${id}`)),
  getRatings: (id: string) => apiRequest(api.get<ApiResponse<UnifiedRating[]>>(`/tools/${id}/rates`)),
}

// Bookings endpoints
export const bookings = {
  getRequests: () => apiRequest(api.get<ApiResponse<Booking[]>>('/bookings/requests')),
  getPetitions: () => apiRequest(api.get<ApiResponse<Booking[]>>('/bookings/petitions')),
  getBooking: (id) => apiRequest(api.get<ApiResponse<Booking>>(`/bookings/${id}`)),
  cancel: (id: BookingActionsParams) =>
    apiRequest(api.post<ApiResponse<BookingActionsReturnType>>(`/bookings/requests/${id}/cancel`)),
  accept: (id: BookingActionsParams) =>
    apiRequest(api.post<ApiResponse<BookingActionsReturnType>>(`/bookings/petitions/${id}/accept`)),
  deny: (id: BookingActionsParams) =>
    apiRequest(api.post<ApiResponse<BookingActionsReturnType>>(`/bookings/petitions/${id}/deny`)),
  create: (data: CreateBookingData) => apiRequest(api.post<ApiResponse<Booking>>('/bookings', data)),
  return: (id: string) => apiRequest(api.post<ApiResponse<Booking>>(`/bookings/${id}/return`)),
  getRatings: () => apiRequest(api.get<ApiResponse<Booking[]>>('/bookings/rates')),
  getSubmittedRatings: () => apiRequest(api.get<ApiResponse<Rating[]>>('/bookings/rates/submitted')),
  getReceivedRatings: () => apiRequest(api.get<ApiResponse<Rating[]>>('/bookings/rates/received')),
  getBookingRatings: (id: string) => apiRequest(api.get<ApiResponse<{ ratings: BookingRating[] }>>(`/bookings/${id}/rate`)),
  submitRating: (data: RateSubmission) =>
    apiRequest(api.post<ApiResponse<void>>(`/bookings/${data.bookingId}/rate`, data)),
  getPendingActions: () => apiRequest(api.get<ApiResponse<BookingPendings>>('/profile/pendings')),
}

// Users endpoints
export const users = {
  updateProfile: (data: Partial<EditProfileFormData>) =>
    apiRequest(api.post<ApiResponse<UserProfile>>('/profile', data)),
  getById: (userId: string) => apiRequest(api.get<ApiResponse<UserProfile>>(`/users/${userId}`)),
  getList: (page: number = 0, search?: string) =>
    apiRequest(api.get<ApiResponse<{ users: UserProfile[] }>>('/users', { params: { page, search } })),
  getUserRatings: (userId: string) => 
    apiRequest(api.get<ApiResponse<UnifiedRating[]>>(`/users/${userId}/rates`)),
}

// images
export const images = {
  uploadImage: (content: string) => apiRequest(api.post<ApiResponse<ImageUploadResponse>>('/images', { content })),
  getImage: (hash: string, thumbnail?: boolean) =>
    `${api.defaults.baseURL}/images/${hash}${thumbnail ? '?thumbnail=true' : ''}`,
}

// Communities endpoints
export const communities = {
  // Get all communities for the current user
  getCommunities: () => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve({
      communities: [
        {
          id: '1',
          name: 'Community 1',
          imageHash: 'hash1',
          members: [{ id: '1', role: 'owner' }]
        },
        {
          id: '2',
          name: 'Community 2',
          imageHash: 'hash2',
          members: [{ id: '1', role: 'user' }]
        }
      ]
    } as CommunityResponse)
  },
  
  // Get all communities for a specific user
  getUserCommunities: (userId: string) => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve([
      {
        id: '1',
        name: 'Community 1',
        imageHash: 'hash1',
        members: [{ id: userId, role: 'owner' as const }]
      },
      {
        id: '2',
        name: 'Community 2',
        imageHash: 'hash2',
        members: [{ id: userId, role: 'user' as const }]
      }
    ] as Community[])
  },
  
  // Get a specific community by ID
  getCommunityById: (id: string) => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve({
      id,
      name: `Community ${id}`,
      imageHash: `hash${id}`,
      members: [
        { id: '1', role: 'owner' },
        { id: '2', role: 'user' },
        { id: '3', role: 'user' }
      ]
    } as CommunityDetailResponse)
  },
  
  // Get users in a community
  getCommunityUsers: (id: string) => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve({
      users: [
        { id: '1', name: 'User 1', email: 'user1@example.com', rating: 4.5, active: true, tokens: 100 },
        { id: '2', name: 'User 2', email: 'user2@example.com', rating: 3.8, active: true, tokens: 50 },
        { id: '3', name: 'User 3', email: 'user3@example.com', rating: 4.2, active: true, tokens: 75 }
      ]
    } as CommunityUsersResponse)
  },
  
  // Create a new community
  createCommunity: (data: CreateCommunityParams) => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve({
      id: Math.random().toString(36).substring(7),
      name: data.name,
      imageHash: data.imageHash,
      members: [{ id: '1', role: 'owner' }]
    } as Community)
  },
  
  // Update a community
  updateCommunity: ({ id, ...data }: UpdateCommunityParams) => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve({
      id,
      name: data.name || `Community ${id}`,
      imageHash: data.imageHash || `hash${id}`,
      members: [{ id: '1', role: 'owner' }]
    } as Community)
  },
  
  // Delete a community
  deleteCommunity: (id: string) => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve()
  },
  
  // Invite a user to a community
  inviteUser: (communityId: string, userId: string) => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve()
  },
  
  // Leave a community
  leaveCommunity: (communityId: string) => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve()
  },
  
  // Get pending invites for the current user
  getInvites: () => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve({
      invites: [
        {
          id: '1',
          communityId: '3',
          communityName: 'Community 3',
          imageHash: 'hash3',
          invitedBy: 'User 2',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          communityId: '4',
          communityName: 'Community 4',
          imageHash: 'hash4',
          invitedBy: 'User 3',
          createdAt: new Date().toISOString()
        }
      ]
    } as CommunityInvitesResponse)
  },
  
  // Accept a community invite
  acceptInvite: (inviteId: string) => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve()
  },
  
  // Refuse a community invite
  refuseInvite: (inviteId: string) => {
    // TODO: Replace with actual API call when backend is ready
    return Promise.resolve()
  }
}

// Info endpoints
export const info = {
  getInfo: () => apiRequest(api.get<ApiResponse<InfoData>>('/info')),
}

export default {
  auth,
  tools,
  bookings,
  users,
  images,
  info,
  communities,
}
