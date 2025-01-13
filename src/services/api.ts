import axios, {AxiosError, AxiosResponse} from 'axios'
import {ILoginParams, IRegisterParams} from '~src/features/auth'
import {LoginResponse} from '~src/features/auth/context/authQueries'
import {createToolParams} from '~src/features/tools/toolsQueries'
import {STORAGE_KEYS} from '../constants'
import type {Booking, SearchFilters, Tool, UserProfile} from '../types'
import {EditProfileFormData, ImageContent} from '../types'

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
  // todo(konv1): move this into a object type
  getUserTools: (params?: SearchFilters) => apiRequest(api.get<ApiResponse<{ tools: Tool[] }>>('/tools', { params })),
  searchTools: (params: {
    term?: string
    categories?: number[]
    distance?: number
    maxCost?: number
    mayBeFree?: boolean
    latitude?: number
    longitude?: number
  }) => apiRequest(api.get<ApiResponse<{ tools: Tool[] }>>('/tools/search', { params })),
  getById: (id: string) => apiRequest(api.get<ApiResponse<Tool>>(`/tools/${id}`)),
  create: (data: createToolParams) =>
    apiRequest(
      api.post<ApiResponse<Tool>>('/tools', {
        ...data,
        cost: Math.max(0, Math.round(data.cost)),
        transportOptions: data.transportOptions.map((t) => Math.max(0, Math.round(t))),
        category: Math.max(0, Math.round(data.category)),
        estimatedValue: Math.max(0, Math.round(data.estimatedValue)),
        height: Math.max(0, Math.round(data.height)),
        weight: Math.max(0, Math.round(data.weight)),
      })
    ),
  update: (id: string, data: FormData) =>
    apiRequest(
      api.put<ApiResponse<Tool>>(`/tools/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    ),
  delete: (id: string) => apiRequest(api.delete<ApiResponse<void>>(`/tools/${id}`)),
}

// Bookings endpoints
export const bookings = {
  // getAll: () => apiRequest(api.get<ApiResponse<Booking[]>>('/bookings')),
  getRequests: () => apiRequest(api.get<ApiResponse<Booking[]>>('/bookings/requests')),
  getPetitions: () => apiRequest(api.get<ApiResponse<Booking[]>>('/bookings/petitions')),
  getById: (id: string) => apiRequest(api.get<ApiResponse<Booking>>(`/bookings/${id}`)),
  create: (data: { toolId: string; startDate: number; endDate: number; contact?: string; comments?: string }) =>
    apiRequest(api.post<ApiResponse<Booking>>('/bookings', data)),
  updateStatus: (id: string, status: Booking['bookingStatus']) =>
    apiRequest(api.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { bookingStatus: status })),
  cancel: (id: string) => apiRequest(api.delete<ApiResponse<void>>(`/bookings/${id}`)),
}

// Ratings endpoints
export const ratings = {
  create: (toolId: number, bookingId: string, data: { rating: number; comment: string }) =>
    apiRequest(api.post<ApiResponse<void>>(`/tools/${toolId}/bookings/${bookingId}/ratings`, data)),
  getByTool: (toolId: string) =>
    apiRequest(
      api.get<
        // todo(konv1): move this into a object type
        ApiResponse<
          {
            rating: number
            comment: string
            user: UserProfile
          }[]
        >
      >(`/tools/${toolId}/ratings`)
    ),
  getByUser: (userId: string) =>
    // todo(konv1): move this into a object type
    apiRequest(api.get<ApiResponse<{ rating: number; comment: string; tool: Tool }[]>>(`/users/${userId}/ratings`)),
}

// Users endpoints
export const users = {
  updateProfile: (data: Partial<EditProfileFormData>) =>
    apiRequest(api.post<ApiResponse<UserProfile>>('/profile', data)),
  getById: (userId: string) => apiRequest(api.get<ApiResponse<UserProfile>>(`/users/${userId}`)),
  // not implemented yet?
  // getTools: (userId: string) => apiRequest(api.get<ApiResponse<Tool[]>>(`/users/${userId}/tools`)),
  // getBookings: (userId: string) => apiRequest(api.get<ApiResponse<Booking[]>>(`/users/${userId}/bookings`)),
}

// images
export const images = {
  // todo(konv1): move this into a object type
  uploadImage: (content: string) => apiRequest(api.post<ApiResponse<{ hash: string }>>('/images', { content })),
  getImage: (hash: string) => apiRequest(api.get<ApiResponse<ImageContent>>(`/images/${hash}`)),
}

export default {
  auth,
  tools,
  bookings,
  ratings,
  users,
  images,
}
