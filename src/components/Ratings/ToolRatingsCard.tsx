import { UnifiedRating } from '~components/Ratings/types'
import { useBookingDetail } from '~components/Bookings/queries'
import { Trans, useTranslation } from 'react-i18next'
import { Box, Card, CardBody, Flex, Heading, Link, Skeleton, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { addDayToDate, convertToDate } from '~utils/dates'
import { UserCard } from '~components/Users/Card'
import { lightText } from '~theme/common'
import { DateRangeTotal } from '~components/Layout/Dates'
import { RatingComments } from '~components/Ratings/RatingComments'
import React from 'react'
import { useToolRatings } from '~components/Tools/queries'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'

interface ToolRatingsProps {
  toolId: string
}

export const ToolRatings = ({ toolId }: ToolRatingsProps) => {
  const { t } = useTranslation()
  const { data: ratings, isLoading } = useToolRatings(toolId)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) {
    return (
      <Box bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg' p={6}>
        <Text>{t('common.loading')}</Text>
      </Box>
    )
  }

  if (!ratings || ratings.length === 0) {
    return null
  }

  return (
    <Box bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg' p={6}>
      <Heading as='h3' size='md' mb={4}>
        {t('rating.ratings')}
      </Heading>
      <Stack spacing={2}>
        {ratings.map((rating) => (
          <RatingCard rating={rating} />
        ))}
      </Stack>
    </Box>
  )
}
const RatingCard = ({ rating }: { rating: UnifiedRating }) => {
  const { data: booking, isLoading } = useBookingDetail({ id: rating.bookingId })
  const { t } = useTranslation()

  if (!rating.owner.rating && !rating.requester.rating) {
    return null
  }

  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgHover = useColorModeValue('gray.50', 'gray.800')

  const startDate = convertToDate(booking?.startDate)
  const endDate = convertToDate(booking?.endDate)

  return (
    <Card variant='outline' mb={4} borderColor={borderColor} _hover={{ bg: bgHover }} transition='background 0.2s'>
      <CardBody>
        <Flex align='center' gap={1} wrap={'wrap'} mb={4}>
          <UserCard
            userId={rating.requester.id}
            borderWidth={0}
            direction='row'
            showAvatar={false}
            p={0}
            ratingProps={{ showCount: false }}
            bgColor={'transparent'}
          />
          <Skeleton isLoaded={!isLoading}>
            <Link as={RouterLink} to={ROUTES.BOOKINGS.DETAIL.replace(':id', booking?.id)}>
              <Text sx={lightText} fontSize='sm'>
                <Trans
                  i18nKey={'tools.lent_from_to'}
                  values={{
                    startDate: startDate,
                    endDate: endDate,
                    format: t('rating.datef'),
                  }}
                  components={{
                    b: <strong />,
                  }}
                />
              </Text>
            </Link>
          </Skeleton>
          <DateRangeTotal begin={startDate} end={addDayToDate(endDate)} isLoaded={!isLoading} />
        </Flex>
        <RatingComments {...rating} />
      </CardBody>
    </Card>
  )
}
