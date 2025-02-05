export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  TOOLS: {
    LIST: '/tools',
    DETAIL: '/tools/:id',
    EDIT: `/tools/:id/edit`,
    NEW: '/tools/new',
  },
  PROFILE: {
    VIEW: '/profile',
    EDIT: '/profile/edit',
  },
  BOOKINGS: {
    PETITIONS: '/bookings/petitions',
    REQUESTS: '/bookings/requests',
  },
  RATINGS: '/ratings',
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:id',
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  ABOUT: '/about',
} as const
