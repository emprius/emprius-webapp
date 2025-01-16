import { Box, Container, Heading, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { UserBookings } from '~components/Bookings/UserBookings'

export const UserBookingsPage = () => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Container maxW='container.xl' py={8}>
      <Box bg={bgColor} borderRadius='lg' p={6} boxShadow='sm'>
        <Heading size='md' mb={4}>
          {t('bookings.myPetitions')}
        </Heading>
        <UserBookings />
      </Box>
    </Container>
  )
}
