import { Box, Container, Heading, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RatingsList } from '~components/Ratings/RatingsList'

export const UserRatingsPage = () => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Container maxW='container.xl' py={8}>
      <Box bg={bgColor} borderRadius='lg' p={6} boxShadow='sm'>
        <Heading size='md' mb={4}>
          {t('rating.pendingRatings')}
        </Heading>
        <RatingsList />
      </Box>
    </Container>
  )
}
