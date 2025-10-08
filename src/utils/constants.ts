import L from 'leaflet'
import markerIcon from '/assets/markers/marker-icon.png'
import markerIcon2x from '/assets/markers/marker-icon-2x.png'
import markerShadow from '/assets/markers/marker-shadow.png'
import toolFallback from '/assets/logos/tool-fallback.svg'
import avatarFallback from '/assets/avatars/fallback.png'

export const AUTH_FORM = {
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  MIN_PASSWORD_LENGTH: 8,
  // Minimum eight characters, at least one letter and one number:
  PASSWORD_REGEX: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
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
 * Map default settings
 */
export const MAP_DEFAULTS = {
  CENTER: {
    // lat: 41.3851,
    // lng: 2.1734,
    lat: 41.8094627,
    lng: 1.3330306,
  },
  ZOOM: 10,
  MIN_ZOOM: 3,
  MAX_ZOOM: 18,
  DEFAULT_RADIUS: 10, // km
  TILE_LAYER: {
    URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  MARKER: L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  }),
  CIRCLE_RADIUS: 1000,
} as const

/**
 * Asset paths
 */
export const ASSETS = {
  TOOL_FALLBACK: toolFallback,
  AVATAR_FALLBACK: avatarFallback,
} as const

// MS interval to update the PWA - more frequent checks to catch updates quickly
export const UPDATE_PWA_INTERVAL = 1000 * 60 * 2 // 2 minutes

export const CONVERSATIONS_REFETCH_INTERVAL = 30000 // 30 seconds
export const CHAT_REFETCH_INTERVAL = 10000 // In chat refetch interval

export const TOOL_MAX_DATE_BOOKING = 12 // months from now that a tool can be booked

export const TOKEN_SYMBOL = 'EUR'
