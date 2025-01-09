export const AUTH_FORM = {
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  MIN_PASSWORD_LENGTH: 2,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
}

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  EXPIRITY: 'auth_expirity',
  USER: 'user_profile',
  LANGUAGE: 'emprius_language',
  THEME: 'emprius_theme',
} as const

/**
 * Tool categories
 */
export const TOOL_CATEGORIES = [
  'power_tools',
  'hand_tools',
  'garden_tools',
  'construction',
  'automotive',
  'cleaning',
  'other',
] as const

export type ToolCategory = (typeof TOOL_CATEGORIES)[number]

/**
 * Tool status types
 */
export const TOOL_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  BOOKED: 'booked',
} as const

export type ToolStatus = (typeof TOOL_STATUS)[keyof typeof TOOL_STATUS]

/**
 * Booking status types
 */
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS]

/**
 * Image upload constraints
 */
export const IMAGE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
} as const

/**
 * Map default settings
 */
export const MAP_DEFAULTS = {
  CENTER: {
    lat: 41.3851,
    lng: 2.1734,
  },
  ZOOM: 12,
  MIN_ZOOM: 3,
  MAX_ZOOM: 18,
  DEFAULT_RADIUS: 10, // km
} as const

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CURRENT_USER: '/auth/me',
  },
  TOOLS: {
    BASE: '/tools',
    SEARCH: '/tools/search',
  },
  BOOKINGS: {
    BASE: '/bookings',
    STATUS: (id: string) => `/bookings/${id}/status`,
  },
  USERS: {
    PROFILE: '/users/profile',
    TOOLS: (id: string) => `/users/${id}/tools`,
    BOOKINGS: (id: string) => `/users/${id}/bookings`,
  },
} as const

/**
 * Query keys for React Query
 */
export const QUERY_KEYS = {
  CURRENT_USER: ['currentUser'],
  TOOLS: ['tools'],
  TOOL: (id: string) => ['tool', id],
  USER_TOOLS: (userId: string) => ['userTools', userId],
  USER_BOOKINGS: (userId: string) => ['userBookings', userId],
  BOOKINGS: ['bookings'],
  BOOKING: (id: string) => ['booking', id],
} as const

/**
 * Asset paths
 */
export const ASSETS = {
  TOOL_FALLBACK: '/assets/tools/tool-fallback.svg',
} as const
