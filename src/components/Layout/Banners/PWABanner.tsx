import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdOutlineIosShare } from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { icons } from '~theme/icons'

export const PWABanner = () => {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isFirefox, setIsFirefox] = useState(false)
  const { isOpen, onClose: originalOnClose } = useDisclosure({
    defaultIsOpen: !localStorage.getItem('pwaBannerDismissed'),
  })

  const onClose = () => {
    localStorage.setItem('pwaBannerDismissed', 'true')
    originalOnClose()
  }
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure()

  // Handle browser events to check if is installable
  useEffect(() => {
    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      console.log('App is already installed')
      return
    }

    // Check if it's iOS or Firefox on Android
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    const isFirefoxAndroid =
      navigator.userAgent.toLowerCase().includes('firefox') && navigator.userAgent.toLowerCase().includes('android')

    setIsIOS(isIOSDevice)
    setIsFirefox(isFirefoxAndroid)

    if (isIOSDevice || isFirefoxAndroid) {
      console.log(isIOSDevice ? 'iOS device detected' : 'Firefox Android detected')
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
    if (isIOS || isFirefox) {
      onDrawerOpen()
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

  // Don't show if not installable, already dismissed, or stored as dismissed
  if (
    !isOpen ||
    (!isInstallable && !isIOS && !isFirefox) ||
    (!deferredPrompt && !isIOS && !isFirefox) ||
    localStorage.getItem('pwaBannerDismissed')
  ) {
    return null
  }

  let title = t('pwa.installMessage')
  if (isIOS) {
    title = t('pwa.installMessageIOS', 'Add to Home Screen for a better experience!')
  } else if (isFirefox) {
    title = t('pwa.installMessageFirefox', 'Install our app for a better experience!')
  }

  return (
    <>
      <Box
        bgGradient='linear(to-r, blue.600, purple.600)'
        pt={3}
        pb={3}
        px={4}
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
        zIndex={900}
      >
        <Flex
          justify='space-between'
          align='center'
          maxW='container.xl'
          mx='auto'
          gap={2}
          direction={{ base: 'column', md: 'row' }}
        >
          <Flex align='center' gap={2}>
            <Icon as={icons.updateAvailable} boxSize={8} />
            <Text>{title}</Text>
          </Flex>
          <Flex gap={2}>
            <Button colorScheme='whiteAlpha' onClick={handleInstall} _hover={{ bg: 'whiteAlpha.300' }}>
              {isIOS || isFirefox ? t('pwa.installButtonIOS', 'How to Install') : t('pwa.installButton')}
            </Button>
            <Button variant='ghost' colorScheme='whiteAlpha' onClick={onClose} _hover={{ bg: 'whiteAlpha.200' }}>
              {t('pwa.notNowButton')}
            </Button>
          </Flex>
        </Flex>
      </Box>
      <InstallDrawer isDrawerOpen={isDrawerOpen} onDrawerClose={onDrawerClose} isFirefox={isFirefox} />
    </>
  )
}

const InstallDrawer = ({
  isDrawerOpen,
  onDrawerClose,
  isFirefox,
}: {
  isDrawerOpen: boolean
  onDrawerClose: () => void
  isFirefox: boolean
}) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const fakeIosButtonProps = {
    bg: bgColor,
    borderWidth: 1,
    borderColor: borderColor,
    borderRadius: 'lg',
    p: 1,
  }

  return (
    <Drawer isOpen={isDrawerOpen} onClose={onDrawerClose} placement='bottom'>
      <DrawerOverlay />
      <DrawerContent borderTopRadius='lg'>
        <DrawerCloseButton />
        <DrawerHeader>{t('pwa.install_instructions_title', 'Install Emprius')}</DrawerHeader>
        <DrawerBody pb={4}>
          <Flex direction='column' gap={4} pb={6} align={'start'}>
            <Text>
              {t(
                'pwa.install_instructions',
                'Install the app on your device to easily access it anytime. No app store. No download. No hassle.'
              )}
            </Text>
            <Divider />
            {isFirefox ? (
              <Flex pl={8} align='center' justify={'start'} gap={2}>
                <Text>{t('pwa.firefox_step1', '1. Open the menu')}</Text>
                <Icon as={BsThreeDotsVertical} boxSize={8} {...fakeIosButtonProps} />
              </Flex>
            ) : (
              <Flex pl={8} align='center' justify={'start'} gap={2}>
                <Text>{t('pwa.ios_step1', '1. Tap on')}</Text>
                <Icon as={MdOutlineIosShare} boxSize={8} {...fakeIosButtonProps} />
              </Flex>
            )}

            <Flex pl={8} align='center' justify={'start'} gap={2} direction={'row'}>
              <Text>{t('pwa.step2', '2. Select')}</Text>
              <Text {...fakeIosButtonProps} px={4} fontWeight={'semibold'}>
                {t('pwa.step2_button', 'Add to Home Screen')}
              </Text>
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
