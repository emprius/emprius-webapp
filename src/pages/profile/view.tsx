import React from 'react'
import { Box, Button, VStack } from '@chakra-ui/react'
import { FiLogOut } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useAuth } from '~components/Auth/AuthContext'
import { UserProfile } from '~components/Users/Profile'

export const View = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <VStack spacing={4} align='center' w={'full'}>
      <UserProfile {...user} />
      <Box>
        <Button leftIcon={<FiLogOut />} onClick={logout} colorScheme='red'>
          {t('nav.logout')}
        </Button>
      </Box>
    </VStack>
  )
}
