import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { HiWifi } from 'react-icons/hi2'
import { useEffect, useState } from 'react'

export const OfflineBanner = () => {
  const { t } = useTranslation()
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <Box
      bgGradient='linear(to-r, orange.500, red.500)'
      p={2}
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
      <Flex justify='center' align='center' gap={2}>
        <Icon as={HiWifi} boxSize={5} />
        <Text fontSize='sm' fontWeight='medium'>
          {t('app.offlineMessage', 'You are currently offline. Some features may be limited.')}
        </Text>
      </Flex>
    </Box>
  )
}
