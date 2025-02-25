import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import api from '~src/services/api'
import { Rating } from '~components/Ratings/types'
import { QueryKey } from '@tanstack/react-query/build/modern/index'
import { ToolsKeys } from '~components/Tools/queries'

export const BookingKeys = {
  bookingsLists: ['bookings'],
  requests: ['bookings', 'requests'],
  petitions: ['bookings', 'petitions'],
  detail: (id): QueryKey => ['booking', id],
}

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
  ratings: Rating[]
}

export const useBookingDetail = ({
  id,
  options,
}: {
  id: string
  options?: Omit<UseQueryOptions<Booking>, 'queryKey' | 'queryFn'>
}) =>
  useQuery({
    queryKey: BookingKeys.detail(id),
    queryFn: () => api.bookings.getBooking(id),
    ...options,
  })

export const useBookingRequests = (options?: Omit<UseQueryOptions<Booking[]>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: BookingKeys.requests,
    queryFn: () => api.bookings.getRequests(),
    ...options,
  })

export const useBookingPetitions = (options?: Omit<UseQueryOptions<Booking[]>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: BookingKeys.petitions,
    queryFn: () => api.bookings.getPetitions(),
    ...options,
  })

export type BookingActionsReturnType = null
export type BookingActionsParams = string
type BookingActionOptions = Omit<
  UseMutationOptions<BookingActionsReturnType, Error, BookingActionsParams>,
  'mutationFn' | 'onSuccess'
>

// Query to accept a booking request
export const useAcceptBooking = (options?: BookingActionOptions) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (bookingId: string) => api.bookings.accept(bookingId),
    onSuccess: (res, bookingId) => {
      invalidateQueries(client, '', bookingId)
    },
    ...options,
  })
}

// Query to deny a booking request
export const useDenyBooking = (options?: BookingActionOptions) => {
  const client = useQueryClient()
  return useMutation<Booking, Error, string>({
    mutationFn: (bookingId: string) => api.bookings.deny(bookingId),
    onSuccess: (res, bookingId) => {
      invalidateQueries(client, res.toolId, bookingId)
    },
    ...options,
  })
}

// Query to cancel a booking request
export const useCancelBooking = (options?: BookingActionOptions) => {
  const client = useQueryClient()
  return useMutation<Booking, Error, string>({
    mutationFn: (bookingId: string) => api.bookings.cancel(bookingId),
    onSuccess: (res, bookingId) => {
      invalidateQueries(client, res.toolId, bookingId)
    },
    ...options,
  })
}

export const useReturnBooking = (options?: BookingActionOptions) => {
  const client = useQueryClient()
  return useMutation<Booking, Error, string>({
    mutationFn: (bookingId: string) => api.bookings.return(bookingId),
    onSuccess: (res, bookingId) => {
      invalidateQueries(client, '', bookingId)
    },
    ...options,
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
const invalidateQueries = (client: QueryClient, toolId?: string, bookingId?: string) => {
  client.invalidateQueries({ queryKey: BookingKeys.bookingsLists })
  client.invalidateQueries({ queryKey: ToolsKeys.tools })
  if (toolId) client.invalidateQueries({ queryKey: ToolsKeys.tool(toolId) })
  if (bookingId) client.invalidateQueries({ queryKey: BookingKeys.detail(bookingId) })
}
