import { Box, Button, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlineRocketLaunch } from 'react-icons/hi2'

export const PWABanner = () => {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      console.log('App is already installed')
      return
    }

    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    if (isIOSDevice) {
      console.log('iOS device detected')
      setIsInstallable(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      console.log('beforeinstallprompt event fired')
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Also listen for appinstalled event
    const installedHandler = () => {
      console.log('App was installed')
      setIsInstallable(false)
      setDeferredPrompt(null)
      onClose()
    }
    window.addEventListener('appinstalled', installedHandler)

    // Debug display mode
    const displayMode = window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'
    console.log('Current display mode:', displayMode)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [onClose])

  const handleInstall = async () => {
    if (isIOS) {
      // For iOS, we just close the banner since installation is done through Add to Home Screen
      onClose()
      return
    }

    if (!deferredPrompt) return

    try {
      console.log('Triggering install prompt')
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log('Install prompt outcome:', outcome)

      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        onClose()
      }
    } catch (error) {
      console.error('Error during installation:', error)
    }
  }

  // Don't show if not installable or already dismissed
  if (!isOpen || (!isInstallable && !isIOS) || (!deferredPrompt && !isIOS)) return null

  return (
    <Box
      bgGradient='linear(to-r, blue.600, purple.600)'
      p={4}
      color='white'
      boxShadow='md'
      position='relative'
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgGradient: 'linear(to-r, whiteAlpha.100, whiteAlpha.200)',
        pointerEvents: 'none',
      }}
    >
      <Flex justify='space-between' align='center' maxW='container.xl' mx='auto'>
        <Flex align='center' gap={2}>
          <Icon as={HiOutlineRocketLaunch} boxSize={8} />
          <Text>
            {isIOS
              ? t('pwa.installMessageIOS', 'Add to Home Screen for a better experience!')
              : t('pwa.installMessage')}
          </Text>
        </Flex>
        <Flex gap={2}>
          <Button colorScheme='whiteAlpha' onClick={handleInstall} _hover={{ bg: 'whiteAlpha.300' }}>
            {isIOS ? t('pwa.installButtonIOS', 'How to Install') : t('pwa.installButton')}
          </Button>
          <Button variant='ghost' colorScheme='whiteAlpha' onClick={onClose} _hover={{ bg: 'whiteAlpha.200' }}>
            {t('pwa.notNowButton')}
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}
