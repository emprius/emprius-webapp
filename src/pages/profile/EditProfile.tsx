import { Box, Container, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { EditProfileForm } from '~components/User/EditProfileForm'

export const EditProfile = () => {
  const tabBg = useColorModeValue('white', 'gray.800')
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Container maxW='container.xl' py={8}>
      <Box position='relative' bg={tabBg} borderRadius='lg' p={6} boxShadow='sm'>
        <EditProfileForm
          initialData={{
            name: user?.name || '',
            email: user?.email || '',
            location: user?.location,
            active: user?.active || false,
            avatarHash: user?.avatarHash,
          }}
          onSuccess={() => navigate(-1)}
        />
      </Box>
    </Container>
  )
}
