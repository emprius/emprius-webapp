# Emprius Web App

Emprius is a web application designed to facilitate tool sharing within communities. It provides a platform where users
can list their tools, search for available tools, manage bookings, and build trust through a rating system.

## Features

- 🛠 Tool sharing and management
- 📅 Booking system
- 🗺 Map-based tool search
- ⭐ User rating system
- 👤 User profiles
- 🌐 Multilingual support (English, Catalan, Spanish)
- 📱 Progressive Web App (PWA) support
- 🌓 Light/Dark mode
- 🗺️ Interactive maps with clustering
- 📸 Image upload and management

## Prerequisites

- Node.js >= 20.x
- Yarn ^1.19.x

## Build and Run

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

3. Copy the environment file and configure your variables:

```bash
cp .env.example .env
```

### Available Scripts

- `yarn dev` - Start development server
- `yarn start` - Alias for `yarn dev`
- `yarn build` - Build for production
- `yarn preview` - Preview production build locally
- `yarn lint` - Run TypeScript type checking and Prettier check
- `yarn lint:fix` - Fix code formatting with Prettier
- `yarn translations` - Update translation files
- `yarn generate-pwa-assets` - Generate PWA assets from logo

### Development

For local development, run:

```bash
yarn dev
```

The development server will start at `http://localhost:5173` (or next available port).

### Production Build

To create a production build:

```bash
yarn build
```

To preview the production build locally:

```bash
yarn preview
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Chakra UI
- React Query (TanStack Query)
- React Router
- i18next
- Leaflet
- PWA (Workbox)
- React Hook Form
- Axios
