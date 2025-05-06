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
    DETAIL: '/bookings/:id',
  },
  RATINGS: {
    PENDING: '/ratings/pending',
    HISTORY: '/ratings/history',
  },
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:id/tools',
    TABS: {
      TOOLS: '/users/:id/tools',
      RATINGS: '/users/:id/ratings',
      COMMUNITIES: '/users/:id/communities',
    },
  },
  COMMUNITIES: {
    LIST: '/communities/list',
    DETAIL: '/communities/:id/members', // Default tab is members
    TABS: {
      MEMBERS: '/communities/:id/members',
      TOOLS: '/communities/:id/tools',
    },
    EDIT: '/communities/:id/edit',
    NEW: '/communities/new',
    INVITES: '/communities/invites',
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  ABOUT: '/about',
} as const
