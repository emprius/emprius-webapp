import axios, {AxiosError, AxiosResponse} from 'axios'
import {ILoginParams, IRegisterParams, LoginResponse} from '~components/Auth/authQueries'
import {Booking, BookingActionsParams, BookingActionsReturnType, CreateBookingData,} from '~components/Bookings/queries'
import {InfoData} from '~components/InfoProviders/InfoContext'
import {BookingPendings} from '~components/InfoProviders/PendingActionsProvider'
import type {RateSubmission, Rating} from '~components/Ratings/types'
import {SearchParams} from '~components/Search/queries'
import {createToolParams, UpdateToolParams} from '~components/Tools/queries'
import {Tool, ToolsListResponse} from '~components/Tools/types'
import {EditProfileFormData, UserProfile} from '~components/Users/types'
import {STORAGE_KEYS} from '~utils/constants'

// Exception to throw when an API return 401
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ? message : 'user not authorized')
  }
}

export interface ApiResponse<T> {
  data?: T
  header: {
    success: boolean
    message: string
  }
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
    throw error
  }
)

async function apiRequest<T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<T> {
  const { data } = await promise
  if (data?.header?.success) {
    return data.data
  }
  throw new Error(data?.header?.message || 'API success is not true')
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
}

// Bookings endpoints
export const bookings = {
  getRequests: () => apiRequest(api.get<ApiResponse<Booking[]>>('/bookings/requests')),
  getPetitions: () => apiRequest(api.get<ApiResponse<Booking[]>>('/bookings/petitions')),
  cancel: (id: BookingActionsParams) =>
    apiRequest(api.post<ApiResponse<BookingActionsReturnType>>(`/bookings/requests/${id}/cancel`)),
  accept: (id: BookingActionsParams) =>
    apiRequest(api.post<ApiResponse<BookingActionsReturnType>>(`/bookings/petitions/${id}/accept`)),
  deny: (id: BookingActionsParams) =>
    apiRequest(api.post<ApiResponse<BookingActionsReturnType>>(`/bookings/petitions/${id}/deny`)),
  create: (data: CreateBookingData) => apiRequest(api.post<ApiResponse<Booking>>('/bookings', data)),
  return: (id: string) => apiRequest(api.post<ApiResponse<Booking>>(`/bookings/${id}/return`)),
  getRatings: () => apiRequest(api.get<ApiResponse<Rating[]>>('/bookings/rates')),
  getSubmittedRatings: () => apiRequest(api.get<ApiResponse<Rating[]>>('/bookings/rates/submitted')),
  getReceivedRatings: () => apiRequest(api.get<ApiResponse<Rating[]>>('/bookings/rates/received')),
  submitRating: (data: RateSubmission) => apiRequest(api.post<ApiResponse<void>>(`/bookings/${data.bookingId}/rate`, {
    rating: data.rating,
    comment: data.comment
  })),
  getPendingActions: () => apiRequest(api.get<ApiResponse<BookingPendings>>('/bookings/pendings')),
}

// Users endpoints
export const users = {
  updateProfile: (data: Partial<EditProfileFormData>) =>
    apiRequest(api.post<ApiResponse<UserProfile>>('/profile', data)),
  getById: (userId: string) => apiRequest(api.get<ApiResponse<UserProfile>>(`/users/${userId}`)),
  getList: (page: number = 0) =>
    apiRequest(api.get<ApiResponse<{ users: UserProfile[] }>>('/users', { params: { page } })),
}

// images
export const images = {
  uploadImage: (content: string) => apiRequest(api.post<ApiResponse<{ hash: string }>>('/images', { content })),
  getImage: (hash: string, thumbnail?: boolean) => `${api.defaults.baseURL}/images/${hash}${thumbnail ? '?thumbnail=true' : ''}`,
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
