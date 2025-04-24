import { Box, Button, Flex, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiLogOut } from 'react-icons/fi'
import { useAuth } from '~components/Auth/AuthContext'
import { MainContainer } from '~components/Layout/LayoutComponents'
import { UserProfile } from '~components/Users/Profile'
import InviteCodes from '~components/Users/InviteCodes'

export const View = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <MainContainer>
      <Flex gap={2} align='center' direction={'column'}>
        <UserProfile {...user} />
        <VStack pb={4} w={'full'}>
          <InviteCodes codes={user?.inviteCodes} />
          <Button leftIcon={<FiLogOut />} onClick={logout} colorScheme='red'>
            {t('nav.logout')}
          </Button>
        </VStack>
      </Flex>
    </MainContainer>
  )
}
