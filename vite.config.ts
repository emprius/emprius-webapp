import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { execSync } from 'child_process'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
const viteconfig = ({ mode }) => {
  // load env variables from .env files
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  let environment = process.env.ENVIRONMENT
  if (!environment) {
    environment = 'dev'
  }

  const outDir = process.env.BUILD_PATH
  const base = process.env.BASE_URL || '/'

  const commit = execSync('git rev-parse --short HEAD').toString()

  const title = process.env.APP_TITLE || 'Emprius App'

  let apiUrl = process.env.API_URL || 'http://localhost:3333'
  if (apiUrl.endsWith('/')) {
    apiUrl = apiUrl.slice(0, -1)
  }

  return defineConfig({
    base,
    build: {
      outDir,
    },
    define: {
      'import.meta.env.ENVIRONMENT': JSON.stringify(environment),
      'import.meta.env.title': JSON.stringify(title),
      'import.meta.env.API_URL': JSON.stringify(apiUrl),
    },
    plugins: [
      tsconfigPaths(),
      react(),
      svgr(),
      VitePWA(pwaManifest),
      createHtmlPlugin({
        template: `index.html`,
        minify: {
          removeComments: false,
          collapseWhitespace: true,
        },
        inject: {
          data: {
            commit: commit.trim(),
            title,
          },
        },
      }),
    ],
  })
}

const pwaManifest: Partial<VitePWAOptions> = {
  registerType: 'prompt',
  manifest: {
    name: 'Emprius',
    short_name: 'Emprius',
    description: 'A platform for sharing tools and resources',
    theme_color: '#319795',
    start_url: '/',
    scope: '/',
    icons: [
      {
        src: 'assets/pwa/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: 'assets/pwa/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: 'assets/pwa/apple-icon-180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/app-api\.emprius\.cat\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /\.(png|jpg|jpeg|svg|gif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
    ],
  },
}

export default viteconfig
