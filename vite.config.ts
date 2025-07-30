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
      // Optimize chunk splitting for better caching
      // rollupOptions: {
      //   output: {
      //     // Create separate chunks for vendor libraries
      //     manualChunks: {
      //       vendor: ['react', 'react-dom', 'react-router-dom'],
      //       ui: ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
      //       utils: ['axios', '@tanstack/react-query', 'i18next', 'react-i18next'],
      //     },
      //     // Ensure consistent chunk naming
      //     chunkFileNames: 'assets/[name]-[hash].js',
      //     entryFileNames: 'assets/[name]-[hash].js',
      //     assetFileNames: 'assets/[name]-[hash].[ext]',
      //   },
      // },
      // // Generate source maps for better debugging
      // sourcemap: mode === 'development',
      // // Optimize for production
      // minify: mode === 'production' ? 'esbuild' : false,
      // // Set reasonable chunk size limits
      // chunkSizeWarningLimit: 1000,
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
  registerType: 'autoUpdate',
  // devOptions: {
  //   enabled: false, // Disable in development to avoid conflicts
  // },
  manifest: {
    name: 'Emprius',
    short_name: 'Emprius',
    description: 'A platform for sharing tools and resources',
    theme_color: '#319795',
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
    // // Clean up old caches
    // cleanupOutdatedCaches: true,
    // // Skip waiting and claim clients immediately
    // skipWaiting: true,
    // clientsClaim: true,
    // // Include all static assets in precache
    // globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    // // Exclude source maps and other dev files
    // globIgnores: ['**/node_modules/**/*', '**/*.map'],
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
          networkTimeoutSeconds: 10,
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
      // Cache JS chunks with StaleWhileRevalidate for better performance
      // {
      //   urlPattern: /\.js$/,
      //   handler: 'StaleWhileRevalidate',
      //   options: {
      //     cacheName: 'js-cache',
      //     expiration: {
      //       maxEntries: 100,
      //       maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
      //     },
      //   },
      // },
      // // Cache CSS files
      // {
      //   urlPattern: /\.css$/,
      //   handler: 'StaleWhileRevalidate',
      //   options: {
      //     cacheName: 'css-cache',
      //     expiration: {
      //       maxEntries: 50,
      //       maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
      //     },
      //   },
      // },
    ],
  },
}

export default viteconfig
