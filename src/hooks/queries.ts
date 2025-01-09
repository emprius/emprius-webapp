import {useMutation, useQuery} from '@tanstack/react-query'
import api from '../services/api'
import type {SearchFilters} from '../types'

// Tools queries
export const useTools = (filters?: SearchFilters) =>
  useQuery({
    queryKey: ['tools', filters],
    queryFn: () => api.tools.getAll(filters),
  })

export const useTool = (id: string) =>
  useQuery({
    queryKey: ['tool', id],
    queryFn: () => api.tools.getById(id),
    enabled: !!id,
  })

export const useCreateTool = () =>
  useMutation({
    mutationFn: (data: FormData) => api.tools.create(data),
  })

export const useUpdateTool = (id: string) =>
  useMutation({
    mutationFn: (data: FormData) => api.tools.update(id, data),
  })

export const useDeleteTool = () =>
  useMutation({
    mutationFn: (id: string) => api.tools.delete(id),
  })

// Bookings queries
export const useBookings = () =>
  useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.bookings.getAll(),
  })

export const useBooking = (id: string) =>
  useQuery({
    queryKey: ['booking', id],
    queryFn: () => api.bookings.getById(id),
    enabled: !!id,
  })

export const useCreateBooking = () =>
  useMutation({
    mutationFn: ({ toolId, data }: { toolId: string; data: { startDate: string; endDate: string } }) =>
      api.bookings.create(toolId, data),
  })

export const useUpdateBookingStatus = () =>
  useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'confirmed' | 'cancelled' | 'completed' }) =>
      api.bookings.updateStatus(id, status),
  })

export const useCancelBooking = () =>
  useMutation({
    mutationFn: (id: string) => api.bookings.cancel(id),
  })

// Rating queries
export const useCreateRating = () =>
  useMutation({
    mutationFn: ({
      toolId,
      bookingId,
      data,
    }: {
      toolId: string
      bookingId: string
      data: { rating: number; comment: string }
    }) => api.ratings.create(toolId, bookingId, data),
  })

export const useToolRatings = (toolId: string) =>
  useQuery({
    queryKey: ['toolRatings', toolId],
    queryFn: () => api.ratings.getByTool(toolId),
    enabled: !!toolId,
  })

export const useUserRatings = (userId: string) =>
  useQuery({
    queryKey: ['userRatings', userId],
    queryFn: () => api.ratings.getByUser(userId),
    enabled: !!userId,
  })

// User queries
export const useUpdateProfile = () =>
  useMutation({
    mutationFn: (data: FormData) => api.users.updateProfile(data),
  })

export const useUserTools = (userId: string) =>
  useQuery({
    queryKey: ['userTools', userId],
    queryFn: () => api.users.getTools(userId),
    enabled: !!userId,
  })

export const useUserBookings = (userId: string) =>
  useQuery({
    queryKey: ['userBookings', userId],
    queryFn: () => api.users.getBookings(userId),
    enabled: !!userId,
  })
