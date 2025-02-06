import { Box, Button, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlineRocketLaunch } from 'react-icons/hi2'

export const PWABanner = () => {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      onClose()
    }
  }

  if (!isOpen || !deferredPrompt) return null

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
          <Text>{t('pwa.installMessage')}</Text>
        </Flex>
        <Flex gap={2}>
          <Button colorScheme='whiteAlpha' onClick={handleInstall} _hover={{ bg: 'whiteAlpha.300' }}>
            {t('pwa.installButton')}
          </Button>
          <Button variant='ghost' colorScheme='whiteAlpha' onClick={onClose} _hover={{ bg: 'whiteAlpha.200' }}>
            {t('pwa.notNowButton')}
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}
