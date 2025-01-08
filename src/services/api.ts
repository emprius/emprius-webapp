import axios, { AxiosError } from 'axios'
import { STORAGE_KEYS } from '../constants'
import type {
  ApiError,
  ApiResponse,
  AuthTokens,
  Booking,
  LoginForm,
  PaginatedResponse,
  RegisterForm,
  SearchFilters,
  Tool,
  UserProfile,
} from '../types'

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
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const auth = {
  login: (data: LoginForm) => api.post<ApiResponse<AuthTokens>>('/login', data),
  register: (data: RegisterForm) => api.post<ApiResponse<AuthTokens>>('/register', data),
  getCurrentUser: () => api.get<ApiResponse<UserProfile>>('/profile'),
}

// Tools endpoints
export const tools = {
  getAll: (params?: SearchFilters) => api.get<PaginatedResponse<Tool>>('/tools', { params }),
  getById: (id: string) => api.get<ApiResponse<Tool>>(`/tools/${id}`),
  create: (data: FormData) =>
    api.post<ApiResponse<Tool>>('/tools', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  update: (id: string, data: FormData) =>
    api.put<ApiResponse<Tool>>(`/tools/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/tools/${id}`),
}

// Bookings endpoints
export const bookings = {
  getAll: () => api.get<PaginatedResponse<Booking>>('/bookings'),
  getById: (id: string) => api.get<ApiResponse<Booking>>(`/bookings/${id}`),
  create: (toolId: string, data: { startDate: string; endDate: string }) =>
    api.post<ApiResponse<Booking>>(`/tools/${toolId}/bookings`, data),
  updateStatus: (id: string, status: Booking['status']) =>
    api.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status }),
  cancel: (id: string) => api.delete<ApiResponse<void>>(`/bookings/${id}`),
}

// Ratings endpoints
export const ratings = {
  create: (toolId: string, bookingId: string, data: { rating: number; comment: string }) =>
    api.post<ApiResponse<void>>(`/tools/${toolId}/bookings/${bookingId}/ratings`, data),
  getByTool: (toolId: string) =>
    api.get<PaginatedResponse<{ rating: number; comment: string; user: UserProfile }>>(`/tools/${toolId}/ratings`),
  getByUser: (userId: string) =>
    api.get<PaginatedResponse<{ rating: number; comment: string; tool: Tool }>>(`/users/${userId}/ratings`),
}

// Users endpoints
export const users = {
  updateProfile: (data: FormData) =>
    api.post<ApiResponse<UserProfile>>('/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getTools: (userId: string) => api.get<PaginatedResponse<Tool>>(`/users/${userId}/tools`),
  getBookings: (userId: string) => api.get<PaginatedResponse<Booking>>(`/users/${userId}/bookings`),
}

export default {
  auth,
  tools,
  bookings,
  ratings,
  users,
}
