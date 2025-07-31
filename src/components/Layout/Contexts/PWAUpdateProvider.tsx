import React, { createContext, useContext, useState, useEffect } from 'react'

type PWAUpdateContextType = {
  isUpdateAvailable: boolean
  isUpdating: boolean
  triggerUpdate: () => void
  dismissUpdate: () => void
}

const PWAUpdateContext = createContext<PWAUpdateContextType>({
  isUpdateAvailable: false,
  isUpdating: false,
  triggerUpdate: () => {},
  dismissUpdate: () => {},
})

export const usePWAUpdate = () => useContext(PWAUpdateContext)

export const PWAUpdateProvider = ({ children }: { children: React.ReactNode }) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSW, setUpdateSW] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null)

  useEffect(() => {
    // Listen for custom events from the service worker registration
    const handleUpdateAvailable = (event: CustomEvent) => {
      setUpdateSW(() => event.detail.updateSW)
      setIsUpdateAvailable(true)
    }

    const handleUpdateReady = () => {
      setIsUpdating(false)
    }

    window.addEventListener('pwa-update-available', handleUpdateAvailable as EventListener)
    window.addEventListener('pwa-update-ready', handleUpdateReady)

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable as EventListener)
      window.removeEventListener('pwa-update-ready', handleUpdateReady)
    }
  }, [])

  const triggerUpdate = async () => {
    if (updateSW && !isUpdating) {
      setIsUpdating(true)
      try {
        await updateSW(true)
        // The page will reload automatically
      } catch (error) {
        console.error('Failed to update PWA:', error)
        setIsUpdating(false)
      }
    }
  }

  const dismissUpdate = () => {
    setIsUpdateAvailable(false)
  }

  const value = {
    isUpdateAvailable,
    isUpdating,
    triggerUpdate,
    dismissUpdate,
  }

  return <PWAUpdateContext.Provider value={value}>{children}</PWAUpdateContext.Provider>
}
