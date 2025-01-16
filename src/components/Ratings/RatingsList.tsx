import { Alert, AlertIcon, Center, SimpleGrid, Spinner } from '@chakra-ui/react'
import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RatingCard } from './RatingCard'
import { useGetPendingRatings } from './ratingQueries'
import { Rating } from './types'

export const RatingsList = () => {
  const { t } = useTranslation()
  const { data: pendingRatings, isLoading, error } = useGetPendingRatings() as UseQueryResult<Rating[]>

  if (isLoading) {
    return (
      <Center minH='200px'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Center>
    )
  }

  if (error) {
    return (
      <Center minH='200px'>
        <Alert status='error' borderRadius='md'>
          <AlertIcon />
          {t('rating.error')}
        </Alert>
      </Center>
    )
  }

  if (!pendingRatings?.length) {
    return (
      <Center minH='200px'>
        <Alert status='info' borderRadius='md'>
          <AlertIcon />
          {t('rating.noRatings')}
        </Alert>
      </Center>
    )
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} autoRows='auto'>
      {pendingRatings.map((rating: Rating, index) => (
        <RatingCard key={index} {...rating} />
      ))}
    </SimpleGrid>
  )
}
