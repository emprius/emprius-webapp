import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import api from '~src/services/api'
import { QueryKey } from '@tanstack/react-query/build/modern/index'
import { ToolsKeys } from '~components/Tools/queries'
import { RatingsKeys } from '~components/Ratings/queries'
import { PendingActionsKeys } from '~components/Layout/Contexts/PendingActionsProvider'
import { Booking, CreateBookingData } from '~components/Bookings/types'

export const BookingKeys = {
  bookingsLists: ['bookings'] as const,
  requests: ['bookings', 'requests'] as const,
  petitions: ['bookings', 'petitions'] as const,
  detail: (id): QueryKey => ['booking', id] as const,
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
    queryFn: () => api.bookings.getIncoming(),
    ...options,
  })

export const useBookingPetitions = (options?: Omit<UseQueryOptions<Booking[]>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: BookingKeys.petitions,
    queryFn: () => api.bookings.getOutgoing(),
    ...options,
  })

export type BookingActionsReturnType = null
export type BookingActionsParams = string
type BookingActionOptions = Omit<
  UseMutationOptions<BookingActionsReturnType, Error, BookingActionsParams>,
  'mutationFn' | 'onSuccess'
>

// Query to accept a booking request
export const useAcceptBooking = (booking: Booking, options?: BookingActionOptions) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (bookingId: string) => api.bookings.update(bookingId, { status: 'ACCEPTED' }),
    onSuccess: (res, bookingId) => {
      invalidateQueries(client, booking.toolId, bookingId)
    },
    ...options,
  })
}

// Query to deny a booking request
export const useDenyBooking = (booking: Booking, options?: BookingActionOptions) => {
  const client = useQueryClient()
  return useMutation<Booking, Error, string>({
    mutationFn: (bookingId: string) => api.bookings.update(bookingId, { status: 'REJECTED' }),
    onSuccess: (res, bookingId) => {
      invalidateQueries(client, booking.toolId, bookingId)
    },
    ...options,
  })
}

// Query to cancel a booking request
export const useCancelBooking = (booking: Booking, options?: BookingActionOptions) => {
  const client = useQueryClient()
  return useMutation<Booking, Error, string>({
    mutationFn: (bookingId: string) => api.bookings.update(bookingId, { status: 'CANCELLED' }),
    onSuccess: (_, bookingId) => {
      invalidateQueries(client, booking.toolId, bookingId)
    },
    ...options,
  })
}

export const useReturnBooking = (booking: Booking, options?: BookingActionOptions) => {
  const client = useQueryClient()
  return useMutation<Booking, Error, string>({
    mutationFn: (bookingId: string) => api.bookings.update(bookingId, { status: 'RETURNED' }),
    onSuccess: async (res, bookingId) => {
      invalidateQueries(client, booking.toolId, bookingId)
      await client.invalidateQueries({ queryKey: RatingsKeys.pending })
      await client.invalidateQueries({ queryKey: PendingActionsKeys })
    },
    ...options,
  })
}

export const usePickedBooking = (booking: Booking, options?: BookingActionOptions) => {
  const client = useQueryClient()
  return useMutation<Booking, Error, string>({
    mutationFn: (bookingId: string) => api.bookings.update(bookingId, { status: 'PICKED' }),
    onSuccess: async (res, bookingId) => {
      invalidateQueries(client, booking.toolId, bookingId)
      await client.invalidateQueries({ queryKey: PendingActionsKeys })
    },
    ...options,
  })
}

export const useCreateBooking = () =>
  useMutation({
    mutationFn: (data: CreateBookingData) => api.bookings.create(data),
  })

// util function to invalidate queries using a client
const invalidateQueries = (client: QueryClient, toolId?: string, bookingId?: string) => {
  client.invalidateQueries({ queryKey: BookingKeys.bookingsLists || ToolsKeys.tools })
  if (toolId) client.invalidateQueries({ queryKey: ToolsKeys.tool(toolId) })
  if (bookingId) client.invalidateQueries({ queryKey: BookingKeys.detail(bookingId) })
}
