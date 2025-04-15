import axios, { AxiosError, AxiosResponse } from 'axios'
import { ILoginParams, IRegisterParams, LoginResponse } from '~components/Auth/queries'
import { InfoData } from '~components/Layout/Contexts/InfoContext'
import { ProfilePendings } from '~components/Layout/Contexts/PendingActionsProvider'
import type { RateSubmission, UnifiedRating } from '~components/Ratings/types'
import { SearchParams } from '~components/Search/queries'
import { CreateToolDTO, ToolDTO, ToolsListResponse, UpdateToolParams } from '~components/Tools/types'
import { EditProfileFormData, EditProfileFormDataDTO, GetUsersDTO, UserProfileDTO } from '~components/Users/types'
import { STORAGE_KEYS } from '~utils/constants'
import { ImageUploadResponse } from '~components/Images/queries'
import { Booking, CreateBookingData, UpdateBookingStatus } from '~components/Bookings/types'

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
  getCurrentUser: () => apiRequest(api.get<ApiResponse<UserProfileDTO>>('/profile')),
}

// Tools endpoints
export const tools = {
  getUserTools: () => apiRequest(api.get<ApiResponse<ToolsListResponse>>('/tools')),
  getUserToolsById: (userId: string) => apiRequest(api.get<ApiResponse<ToolsListResponse>>(`/tools/user/${userId}`)),
  searchTools: (params: SearchParams) =>
    apiRequest(api.get<ApiResponse<ToolsListResponse>>('/tools/search', { params })),
  getById: (id: string) => apiRequest(api.get<ApiResponse<ToolDTO>>(`/tools/${id}`)),
  create: (data: CreateToolDTO) =>
    apiRequest(
      api.post<ApiResponse<ToolDTO>>('/tools', {
        ...data,
      })
    ),
  update: ({ id, ...data }: Partial<CreateToolDTO>) => apiRequest(api.put<ApiResponse<ToolDTO>>(`/tools/${id}`, data)),
  delete: (id: string) => apiRequest(api.delete<ApiResponse<void>>(`/tools/${id}`)),
  getRatings: (id: string) => apiRequest(api.get<ApiResponse<UnifiedRating[]>>(`/tools/${id}/ratings`)),
}

// Bookings endpoints
export const bookings = {
  getIncoming: () => apiRequest(api.get<ApiResponse<Booking[]>>('/bookings/requests/incoming')),
  getOutgoing: () => apiRequest(api.get<ApiResponse<Booking[]>>('/bookings/requests/outgoing')),
  getBooking: (id) => apiRequest(api.get<ApiResponse<Booking>>(`/bookings/${id}`)),
  create: (data: CreateBookingData) => apiRequest(api.post<ApiResponse<Booking>>('/bookings', data)),
  update: (id: string, data: UpdateBookingStatus) => apiRequest(api.put<ApiResponse<Booking>>(`/bookings/${id}`, data)),
  getPendingRatings: () => apiRequest(api.get<ApiResponse<Booking[]>>('/bookings/ratings/pending')),
  getBookingRatings: (id: string) => apiRequest(api.get<ApiResponse<UnifiedRating>>(`/bookings/${id}/ratings`)),
  submitRating: (data: RateSubmission) =>
    apiRequest(api.post<ApiResponse<void>>(`/bookings/${data.bookingId}/ratings`, data)),
}

// Users endpoints
export const users = {
  updateProfile: (data: Partial<EditProfileFormDataDTO>) =>
    apiRequest(api.post<ApiResponse<UserProfileDTO>>('/profile', data)),
  getById: (userId: string) => apiRequest(api.get<ApiResponse<UserProfileDTO>>(`/users/${userId}`)),
  getList: (page: number = 0) => apiRequest(api.get<ApiResponse<GetUsersDTO>>('/users', { params: { page } })),
  getUserRatings: (userId: string) => apiRequest(api.get<ApiResponse<UnifiedRating[]>>(`/users/${userId}/ratings`)),
  getPendingActions: () => apiRequest(api.get<ApiResponse<ProfilePendings>>('/profile/pendings')),
  getMoreCodes: () => apiRequest(api.post<ApiResponse<void>>('/profile/codes')),
}

// images
export const images = {
  uploadImage: (content: string) => apiRequest(api.post<ApiResponse<ImageUploadResponse>>('/images', { content })),
  getImage: (hash: string, thumbnail?: boolean) =>
    `${api.defaults.baseURL}/images/${hash}${thumbnail ? '?thumbnail=true' : ''}`,
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
}
