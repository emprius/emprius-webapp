import { registerSW } from 'virtual:pwa-register'
import { UPDATE_PWA_INTERVAL } from '~utils/constants'

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      onNeedRefresh() {
        updateSW(true)
      },
      onOfflineReady() {
        // Handle offline ready notification through PWAContext toast
        console.log('App ready to work offline')
      },
      onRegistered(registration) {
        if (registration) {
          setInterval(() => {
            console.log('Interval!')
            registration.update()
          }, UPDATE_PWA_INTERVAL) // Check for updates every hour
        }
      },
      onRegisterError(error) {
        console.error('SW registration failed:', error)
      },
    })
  }
}
