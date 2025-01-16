import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import api from '~src/services/api'

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Booking {
  id: string
  toolId: string
  fromUserId: string
  toUserId: string
  startDate: number
  endDate: number
  contact?: string
  comments?: string
  bookingStatus: BookingStatus
  createdAt: string
  updatedAt: string
}

export const useBookingRequests = (options?: Omit<UseQueryOptions<Booking[]>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: ['bookingRequests'],
    queryFn: () => api.bookings.getRequests(),
    ...options,
  })
export const useBookingPetitions = (options?: Omit<UseQueryOptions<Booking[]>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: ['bookingPetitions'],
    queryFn: () => api.bookings.getPetitions(),
    ...options,
  })
export const useUpdateBookingStatus = () => {
  const client = useQueryClient()
  return useMutation<Booking, Error, { bookingId: string; status: 'confirmed' | 'cancelled' }>({
    mutationFn: ({ bookingId, status }) => api.bookings.updateStatus(bookingId, status),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['bookingRequests'] })
      client.invalidateQueries({ queryKey: ['bookingPetitions'] })
    },
  })
}

interface CreateBookingData {
  toolId: string
  startDate: number
  endDate: number
  contact?: string
  comments?: string
}

export const useCreateBooking = () =>
  useMutation({
    mutationFn: (data: CreateBookingData) => api.bookings.create(data),
  })
