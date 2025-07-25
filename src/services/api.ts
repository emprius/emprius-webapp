import axios, { AxiosError, AxiosResponse } from 'axios'
import { ILoginParams, IRegisterParams, LoginResponse } from '~components/Auth/queries'
import { InfoData } from '~components/Layout/Contexts/InfoContext'
import { ProfilePendings } from '~components/Layout/Contexts/PendingActionsProvider'
import { RateSubmission, UnifiedRating, UnifiedRatingsResponse } from '~components/Ratings/types'
import { SearchParams } from '~components/Search/queries'
import { CreateToolDTO, ToolDTO, ToolsListResponse } from '~components/Tools/types'
import {
  EditProfileFormDataDTO,
  NotificationPreferences,
  ToolHistoryResponse,
  UserProfileDTO,
} from '~components/Users/types'
import { STORAGE_KEYS } from '~utils/constants'
import { ImageUploadResponse } from '~components/Images/queries'
import { Booking, BookingsListResponse, CreateBookingData, UpdateBookingStatus } from '~components/Bookings/types'
import {
  CommunitiesListResponse,
  Community,
  CommunityInvitesResponse,
  CommunityUsersResponse,
  CreateCommunityParams,
  UpdateCommunityParams,
} from '~components/Communities/types'
import { PaginationApiParams } from '~components/Layout/Pagination/Pagination'
import { SearchAndPaginationApiParams } from '~components/Layout/Search/SearchAndPagination'
import { ToolsListParams } from '~components/Tools/queries'

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

export type ApiResponse<T> = {
  data?: T
  header: ApiResponseHeader
}

export type PaginationInfo = {
  pagination: {
    current: number
    pageSize: number
    total: number
    pages: number
  }
}

export type PaginatedApiResponse<T> = Omit<ApiResponse<T>, 'data'> & {
  data: T & PaginationInfo
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
  getCurrentUser: () => apiRequest(api.get<ApiResponse<UserProfileDTO>>('/profile')),
}

// Tools endpoints
export const tools = {
  getUserTools: (params: ToolsListParams) =>
    apiRequest(api.get<PaginatedApiResponse<ToolsListResponse>>(`/tools`, { params })),
  getUserToolsById: (userId: string, params: ToolsListParams) =>
    apiRequest(api.get<PaginatedApiResponse<ToolsListResponse>>(`/tools/user/${userId}`, { params })),
  searchTools: (params: SearchParams) =>
    apiRequest(api.get<PaginatedApiResponse<ToolsListResponse>>('/tools/search', { params })),
  getById: (id: string) => apiRequest(api.get<ApiResponse<ToolDTO>>(`/tools/${id}`)),
  create: (data: CreateToolDTO) =>
    apiRequest(
      api.post<ApiResponse<ToolDTO>>('/tools', {
        ...data,
      })
    ),
  update: ({ id, ...data }: Partial<CreateToolDTO>) => apiRequest(api.put<ApiResponse<ToolDTO>>(`/tools/${id}`, data)),
  delete: (id: string) => apiRequest(api.delete<ApiResponse<void>>(`/tools/${id}`)),
  getRatings: (id: string, params: PaginationApiParams) =>
    apiRequest(api.get<PaginatedApiResponse<UnifiedRatingsResponse>>(`/tools/${id}/ratings`, { params })),
  getHistory: (id: string) => apiRequest(api.get<ApiResponse<ToolHistoryResponse>>(`/tools/${id}/history`)),
}

// Bookings endpoints
export const bookings = {
  getIncoming: (params: PaginationApiParams) =>
    apiRequest(api.get<PaginatedApiResponse<BookingsListResponse>>('/bookings/requests/incoming', { params })),
  getOutgoing: (params: PaginationApiParams) =>
    apiRequest(api.get<PaginatedApiResponse<BookingsListResponse>>('/bookings/requests/outgoing', { params })),
  getBooking: (id: string) => apiRequest(api.get<ApiResponse<Booking>>(`/bookings/${id}`)),
  create: (data: CreateBookingData) => apiRequest(api.post<ApiResponse<Booking>>('/bookings', data)),
  update: (id: string, data: UpdateBookingStatus) => apiRequest(api.put<ApiResponse<Booking>>(`/bookings/${id}`, data)),
  getPendingRatings: (params: PaginationApiParams) =>
    apiRequest(api.get<PaginatedApiResponse<BookingsListResponse>>('/bookings/ratings/pending', { params })),
  getBookingRatings: (id: string) => apiRequest(api.get<ApiResponse<UnifiedRating>>(`/bookings/${id}/ratings`)),
  submitRating: (data: RateSubmission) =>
    apiRequest(api.post<ApiResponse<void>>(`/bookings/${data.bookingId}/ratings`, data)),
}

// Users endpoints
export const users = {
  updateProfile: (data: Partial<EditProfileFormDataDTO>) =>
    apiRequest(api.post<ApiResponse<UserProfileDTO>>('/profile', data)),
  getById: (userId: string) => apiRequest(api.get<ApiResponse<UserProfileDTO>>(`/users/${userId}`)),
  getList: (params: SearchAndPaginationApiParams) =>
    apiRequest(api.get<PaginatedApiResponse<{ users: UserProfileDTO[] }>>('/users', { params })),
  getUserRatings: (userId: string, params: PaginationApiParams) =>
    apiRequest(api.get<PaginatedApiResponse<UnifiedRatingsResponse>>(`/users/${userId}/ratings`, { params })),
  getPendingActions: () => apiRequest(api.get<ApiResponse<ProfilePendings>>('/profile/pendings')),
  getMoreCodes: () => apiRequest(api.post<ApiResponse<void>>('/profile/invites')),
  // Get all communities for a specific user
  getUserCommunities: (userId: string, params: SearchAndPaginationApiParams) =>
    apiRequest(api.get<PaginatedApiResponse<CommunitiesListResponse>>(`/users/${userId}/communities`, { params })),
  updateNotificationPreferences: (data: NotificationPreferences) =>
    apiRequest(api.post<ApiResponse<void>>('/profile/notifications', { ...data })),
}

// images
export const images = {
  uploadImage: (content: string) => apiRequest(api.post<ApiResponse<ImageUploadResponse>>('/images', { content })),
  getImage: (hash: string, thumbnail?: boolean) =>
    hash?.length ? `${api.defaults.baseURL}/images/${hash}${thumbnail ? '?thumbnail=true' : ''}` : '',
}

// Communities endpoints
export const communities = {
  // Create a new community
  createCommunity: (data: CreateCommunityParams) => apiRequest(api.post<ApiResponse<Community>>(`/communities`, data)),
  // Get a specific community by ID
  getCommunityById: (id: string) => apiRequest(api.get<ApiResponse<Community>>(`/communities/${id}`)),
  // Update community
  updateCommunity: (id: string, data: UpdateCommunityParams) =>
    apiRequest(api.put<ApiResponse<Community>>(`/communities/${id}`, data)),
  // Delete
  deleteCommunity: (id: string) => apiRequest(api.delete<ApiResponse<void>>(`/communities/${id}`)),
  // Get community tools
  getCommunityTools: (id: string, params: SearchAndPaginationApiParams) =>
    apiRequest(api.get<PaginatedApiResponse<ToolsListResponse>>(`/communities/${id}/tools`, { params })),
  // Get users in a community
  getCommunityMembers: (id: string, params: SearchAndPaginationApiParams) =>
    apiRequest(api.get<PaginatedApiResponse<CommunityUsersResponse>>(`/communities/${id}/members`, { params })),
  // Invite a user to a community
  inviteUser: (id: string, userId: string) =>
    apiRequest(api.post<ApiResponse<CommunityUsersResponse>>(`/communities/${id}/members/${userId}`)),
  // Leave community
  leaveCommunity: (id: string) =>
    apiRequest(api.delete<ApiResponse<CommunityUsersResponse>>(`/communities/${id}/members`)),
  // Remove a user to a community
  removeUser: (id: string, userId: string) =>
    apiRequest(api.delete<ApiResponse<CommunityUsersResponse>>(`/communities/${id}/members/${userId}`)),
  // Get pending invites for the current user
  getInvites: () => apiRequest(api.get<ApiResponse<CommunityInvitesResponse>>(`/communities/invites`)),
  // Update invite status
  updateInvite: (id, status: 'REJECTED' | 'ACCEPTED' | 'CANCELED') =>
    apiRequest(api.put<ApiResponse<CommunityInvitesResponse>>(`/communities/invites/${id}`, { status: status })),
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
