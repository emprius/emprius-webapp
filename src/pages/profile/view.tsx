import { Box, Button, Flex } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiLogOut } from 'react-icons/fi'
import { useAuth } from '~components/Auth/AuthContext'
import { MainContainer } from '~components/Layout/LayoutComponents'
import { UserProfile } from '~components/Users/Profile'

export const View = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <MainContainer>
      <Flex gap={2} align='center' direction={'column'}>
        <UserProfile {...user} />
        <Box pb={4}>
          <Button leftIcon={<FiLogOut />} onClick={logout} colorScheme='red'>
            {t('nav.logout')}
          </Button>
        </Box>
      </Flex>
    </MainContainer>
  )
}
