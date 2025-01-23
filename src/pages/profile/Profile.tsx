import { Box, Container, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { UserInfo } from '~components/User/UserInfo'

export const Profile = () => {
  const tabBg = useColorModeValue('white', 'gray.800')
  return (
    <Container maxW='container.xl' py={8}>
      <Box position='relative' bg={tabBg} borderRadius='lg' p={6} boxShadow='sm'>
        <UserInfo />
      </Box>
    </Container>
  )
}
