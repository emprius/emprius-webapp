import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import api from '~src/services/api'
import { Booking } from '~src/types'

export const useUserTools = () =>
  useQuery({
    queryKey: ['userTools'],
    queryFn: () => api.tools.getUserTools(),
  })

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
