import { registerSW } from 'virtual:pwa-register'
import { UPDATE_PWA_INTERVAL } from '~utils/constants'

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      immediate: true, // Register immediately
      onNeedRefresh() {
        console.log('New app version available, updating...')
        updateSW(true) // Force update immediately
      },
      onOfflineReady() {
        console.log('App ready to work offline')
      },
      onRegisteredSW(swScriptUrl, registration) {
        if (registration) {
          // Check for updates more frequently
          setInterval(() => {
            registration.update()
          }, UPDATE_PWA_INTERVAL)

          // Also check for updates when the app becomes visible
          document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
              registration.update()
            }
          })

          // Check for updates when the window gains focus
          window.addEventListener('focus', () => {
            registration.update()
          })
        }
      },
      onRegisterError(error) {
        console.error('SW registration failed:', error)
      },
    })

    // Handle service worker updates and chunk loading errors
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker controller changed, reloading...')
        // Clear all caches when service worker updates
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name))
          }).finally(() => {
            (window as any).location.reload()
          })
        } else {
          (window as any).location.reload()
        }
      })

      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache updated, new version available')
          // Optionally show a notification to the user
        }
      })
    }
  }
}
