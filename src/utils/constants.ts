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
    lat: 41.3851,
    lng: 2.1734,
  },
  ZOOM: 12,
  MIN_ZOOM: 3,
  MAX_ZOOM: 18,
  DEFAULT_RADIUS: 10, // km
  TILE_LAYER: {
    URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
} as const

/**
 * Asset paths
 */
export const ASSETS = {
  TOOL_FALLBACK: '/assets/tools/tool-fallback.svg',
  AVATAR_FALLBACK: '/assets/avatars/fallback.png',
} as const
