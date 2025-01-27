import { registerSW } from 'virtual:pwa-register'

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm('New content available. Reload?')) {
          updateSW(true)
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline')
      },
      onRegistered(registration) {
        if (registration) {
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000) // Check for updates every hour
        }
      },
      onRegisterError(error) {
        console.error('SW registration failed:', error)
      }
    })
  }
}
