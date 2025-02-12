import L from 'leaflet'

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
    iconUrl: '/assets/markers/marker-icon.png',
    iconRetinaUrl: '/assets/markers/marker-icon-2x.png',
    shadowUrl: '/assets/markers/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  }),
} as const

/**
 * Asset paths
 */
export const ASSETS = {
  TOOL_FALLBACK: '/assets/tools/tool-fallback.svg',
  AVATAR_FALLBACK: '/assets/avatars/fallback.png',
} as const

// MS intervall to update the PWA
export const UPDATE_PWA_INTERVAL = 1000 * 60 * 30 // 30 minutes
