import { Box, Button, Container, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '~components/Auth/AuthContext'
import { EditProfileForm } from '~components/User/EditProfileForm'
import { UserInfo } from '~components/User/UserInfo'
import { ROUTES } from '~src/router/router'

export const Profile = () => {
  const tabBg = useColorModeValue('white', 'gray.800')
  const { isOpen, onToggle } = useDisclosure()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Container maxW='container.xl' py={8}>
      <Box position='relative' bg={tabBg} borderRadius='lg' p={6} boxShadow='sm'>
        {isOpen ? (
          <EditProfileForm
            initialData={{
              name: user?.name || '',
              email: user?.email || '',
              location: user?.location,
              active: user?.active || false,
              avatarHash: user?.avatarHash,
            }}
            onSuccess={onToggle}
          />
        ) : (
          <UserInfo onEdit={onToggle} />
        )}
      </Box>
      <Button mt={4} colorScheme='blue' onClick={() => navigate(ROUTES.TOOLS.LIST)}>
        {t('user.my_tools')}
      </Button>
    </Container>
  )
}
