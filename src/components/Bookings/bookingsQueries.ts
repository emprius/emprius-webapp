import { QueryClient, useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import api from '~src/services/api'

export enum BookingStatus {
  PENDING = 'PENDING', // Requested by the user awaiting approval
  ACCEPTED = 'ACCEPTED', // Approved by the owner
  CANCELLED = 'CANCELLED', // Cancelled by the requester
  REJECTED = 'REJECTED', // Denied by the owner
  RETURNED = 'RETURNED', // Completed by both parties
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
  return useMutation<Booking, Error, { bookingId: string; status: 'ACCEPTED' | 'CANCELLED' }>({
    mutationFn: ({ bookingId, status }) =>
      api.bookings.updateStatus(bookingId, status === 'ACCEPTED' ? BookingStatus.ACCEPTED : BookingStatus.CANCELLED),
    onSuccess: (res) => {
      invalidateQueries(client, res.toolId)
    },
  })
}

export const useReturnBooking = () => {
  const client = useQueryClient()
  return useMutation<Booking, Error, string>({
    mutationFn: (bookingId: string) => api.bookings.return(bookingId),
    onSuccess: (res) => {
      invalidateQueries(client, res.toolId)
    },
  })
}

export interface CreateBookingData {
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

// util function to invalidate queries using a client
const invalidateQueries = (client: QueryClient, toolId: string) => {
  client.invalidateQueries({ queryKey: ['bookingRequests'] })
  client.invalidateQueries({ queryKey: ['bookingPetitions'] })
  client.invalidateQueries({ queryKey: ['tools'] })
  client.invalidateQueries({ queryKey: ['tool', toolId] })
}
