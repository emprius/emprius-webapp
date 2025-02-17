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
import { HiOutlineRocketLaunch } from 'react-icons/hi2'
import { MdOutlineIosShare } from 'react-icons/md'

export const PWABanner = () => {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure()

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

  // Don't show if not installable or already dismissed
  if (!isOpen || (!isInstallable && !isIOS) || (!deferredPrompt && !isIOS)) return null

  return (
    <>
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
        zIndex={900}
      >
        <Flex justify='center' align='center' maxW='container.xl' mx='auto' gap={4} direction={'column'}>
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
      <IosDrawer isDrawerOpen={isDrawerOpen} onDrawerClose={onDrawerClose} />
    </>
  )
}

const IosDrawer = ({ isDrawerOpen, onDrawerClose }: { isDrawerOpen: boolean; onDrawerClose: () => void }) => {
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
        <DrawerHeader>{t('pwa.ios_install_title', 'Install Progressier')}</DrawerHeader>
        <DrawerBody pb={4}>
          <Flex direction='column' gap={4} pb={6} align={'start'}>
            <Text>
              {t(
                'pwa.ios_install_instructions',
                'Install the app on your device to easily access it anytime. No app store. No download. No hassle.'
              )}
            </Text>
            <Divider />
            <Flex pl={8} align='center' justify={'start'} gap={2}>
              <Text>{t('pwa.ios_step1', '1. Tap on')}</Text>
              <Icon as={MdOutlineIosShare} boxSize={8} {...fakeIosButtonProps} />
            </Flex>
            <Flex pl={8} align='center' justify={'start'} gap={2} direction={'row'}>
              <Text>{t('pwa.ios_step2', '2. Select')}</Text>
              <Text variant={'ghost'} {...fakeIosButtonProps} px={4} fontWeight={'semibold'}>
                {t('pwa.ios_step2_button', 'Add to Home Screen')}
              </Text>
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
