import { useMutation, useQuery } from '@tanstack/react-query'
import { getB64FromFile } from '~src/utils'
import api from '../services/api'

export const useUploadImage = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const base64 = await getB64FromFile(file)
      return api.images.uploadImage(base64)
    },
  })

// Bookings queries
// export const useBookings = () =>
//   useQuery({
//     queryKey: ['bookings'],
//     queryFn: () => api.bookings.getAll(),
//   })

export const useBooking = (id: string) =>
  useQuery({
    queryKey: ['booking', id],
    queryFn: () => api.bookings.getById(id),
    enabled: !!id,
  })

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

export const useUpdateBookingStatus = () =>
  useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'confirmed' | 'cancelled' | 'completed' }) =>
      api.bookings.updateStatus(id, status),
  })

export const useCancelBooking = () =>
  useMutation({
    mutationFn: (id: string) => api.bookings.cancel(id),
  })

// User queries
// export const useUpdateProfile = () =>
//   useMutation({
//     mutationFn: (data: FormData) => api.users.updateProfile(data),
//   })

// export const useUserTools = (userId: string) =>
//   useQuery({
//     queryKey: ['userTools', userId],
//     queryFn: () => api.users.getTools(userId),
//     enabled: !!userId,
//   })
//
// export const useUserBookings = (userId: string) =>
//   useQuery({
//     queryKey: ['userBookings', userId],
//     queryFn: () => api.users.getBookings(userId),
//     enabled: !!userId,
//   })
