export enum BookingStatus {
  PENDING = 'PENDING', // Requested by the user awaiting approval
  ACCEPTED = 'ACCEPTED', // Approved by the owner
  CANCELLED = 'CANCELLED', // Cancelled by the requester
  REJECTED = 'REJECTED', // Denied by the owner
  PICKED = 'PICKED', // Tool has been picked up by the requester
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
  bookingStatus: BookingStatus
  createdAt: string
  updatedAt: string
  isRated: boolean
  isNomadic: boolean
  comments: string
}

export interface UpdateBookingStatus {
  status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'RETURNED' | 'PICKED'
}

export interface CreateBookingData {
  toolId: string
  startDate: number
  endDate: number
  contact?: string
  comments?: string
}

export type BookingsListResponse = { bookings: Booking[] }
