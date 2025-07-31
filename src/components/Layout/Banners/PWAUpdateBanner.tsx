import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { icons } from '~theme/icons'
import { usePWAUpdate } from '~components/Layout/Contexts/PWAUpdateProvider'

export const PWAUpdateBanner = () => {
  const { isUpdateAvailable, isUpdating, triggerUpdate } = usePWAUpdate()
  const { t } = useTranslation()

  if (!isUpdateAvailable) {
    return null
  }

  return (
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
          <Text>
            {t('pwa.update_title', {
              defaultValue:
                'New version is available, upgrade it as soon as posible or the app may not work as expected!',
            })}
          </Text>
        </Flex>
        <Flex gap={2}>
          <Button
            colorScheme='whiteAlpha'
            onClick={triggerUpdate}
            _hover={{ bg: 'whiteAlpha.300' }}
            isLoading={isUpdating}
          >
            {t('pwa.update_button', { defaultValue: 'Update' })}
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}
