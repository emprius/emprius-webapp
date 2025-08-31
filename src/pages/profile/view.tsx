import { Box, Button, Flex, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiLogOut } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { MainContainer } from '~components/Layout/LayoutComponents'
import { UserProfile } from '~components/Users/Profile'
import InviteCodes from '~components/Users/InviteCodes'
import NotificationSettings from '~components/Users/NotificationSettings'

export const View = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const location = useLocation()

  // Handle hash navigation to scroll to specific sections
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1) // Remove the '#' from hash
      const element = document.getElementById(elementId)
      if (element) {
        // Use setTimeout to ensure the component is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [location.hash])

  return (
    <MainContainer>
      <Flex gap={2} align='center' direction={'column'}>
        <UserProfile {...user} />
        <VStack pb={4} w={'full'}>
          <InviteCodes codes={user?.inviteCodes} />
          <NotificationSettings notificationPreferences={user.notificationPreferences} />
          <Button leftIcon={<FiLogOut />} onClick={logout} colorScheme='red'>
            {t('nav.logout')}
          </Button>
        </VStack>
      </Flex>
    </MainContainer>
  )
}
