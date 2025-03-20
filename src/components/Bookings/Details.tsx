import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  StackProps,
  Text,
  TextProps,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FiPhone } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { ActionButtons } from '~components/Bookings/Actions'
import { BookingDates } from '~components/Bookings/BookingDates'
import { StatusBadge } from '~components/Bookings/StatusBage'
import { BookingActionsProvider } from '~components/Bookings/ActionsProvider'
import { CostDay } from '~components/Tools/shared/CostDay'
import { ToolImageAvailability } from '~components/Tools/shared/ToolImage'
import { Tool } from '~components/Tools/types'
import { UserCard } from '~components/Users/Card'
import { ROUTES } from '~src/router/routes'
import { lighterText, lightText } from '~theme/common'
import { icons } from '~theme/icons'
import { Booking, BookingStatus } from './queries'
import { useAuth } from '~components/Auth/AuthContext'
import { Earned } from '~components/Bookings/Card'
import { RatingComments } from '~components/Ratings/RatingComments'
import { useGetBookingRatings } from '~components/Ratings/queries'
import { UnifiedRating } from '~components/Ratings/types'

interface BookingDetailsProps {
  booking: Booking
  tool: Tool
  userId: string
}

// Component for displaying contact information and comments
const BookingComments = ({ booking }: { booking: Booking }) => {
  const textColor = useColorModeValue('gray.600', 'gray.200')

  return (
    <Card variant='bookingDetail'>
      <CardHeader>
        <HStack spacing={2}>
          <Icon as={icons.messageBubble} />
          <Text fontWeight='medium'>Contact & Comments</Text>
        </HStack>
      </CardHeader>
      <CardBody color={textColor}>
        <Stack spacing={4}>
          <HStack spacing={3} align='center'>
            <Icon as={FiPhone} boxSize={5} color='primary.500' />
            <Text fontSize='md' fontWeight='medium'>
              {booking.contact}
            </Text>
          </HStack>
          <BookingComment comments={booking.comments} />
        </Stack>
      </CardBody>
    </Card>
  )
}

export const BookingComment = ({
  comments,
  textProps,
  ...props
}: {
  comments: string
  textProps?: TextProps
} & StackProps) => {
  return (
    <Stack direction='row' align='flex-start' spacing={3} {...props}>
      <Box mt={1}>
        <Icon as={icons.messageBubble} color='primary.400' boxSize={5} />
      </Box>
      <Text fontSize='md' lineHeight='tall' {...textProps}>
        {comments}
      </Text>
    </Stack>
  )
}

// Component for displaying user information
const UserInfo = ({ userId }: { userId: string }) => {
  const { t } = useTranslation()

  return (
    <Card variant='bookingDetail'>
      <CardHeader>
        <HStack spacing={2}>
          <Icon as={icons.user} />
          <Text fontWeight='medium'>{t('bookings.user_info')}</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <UserCard userId={userId} borderWidth={0} p={0} />
      </CardBody>
    </Card>
  )
}

// Component for displaying tool information
const ToolInfo = ({ tool, booking, isRequest }: { tool: Tool; booking: Booking; isRequest: boolean }) => {
  const { t } = useTranslation()
  const toolDetailUrl = ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())
  const imageSize = useBreakpointValue({ base: '120px', md: '160px' })

  return (
    <Card variant='bookingDetail'>
      <CardHeader>
        <HStack spacing={2}>
          <Icon as={icons.tools} />
          <Text fontWeight='medium'>{t('bookings.tool_info')}</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <Flex direction={{ base: 'column', sm: 'row' }} gap={5} align={{ base: 'center', sm: 'start' }}>
          {/* Tool Image */}
          <Box flex={{ base: '1', sm: `0 0 ${imageSize}` }} mb={{ base: 3, sm: 0 }}>
            <Link as={RouterLink} to={toolDetailUrl}>
              <ToolImageAvailability
                imageId={tool.images?.[0] ?? ''}
                isAvailable={tool.isAvailable}
                isLoading={!tool}
                toolId={tool.id}
                alt={tool.title}
                w={'100%'}
                maxW={imageSize}
                maxH={imageSize}
                minH={imageSize}
                h={'100%'}
                borderRadius='md'
              />
            </Link>
          </Box>

          {/* Tool Information */}
          <Stack spacing={4} flex={1} w='full'>
            <Link
              as={RouterLink}
              to={toolDetailUrl}
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight='semibold'
              _hover={{ color: 'primary.500', textDecoration: 'none' }}
            >
              {tool.title}
            </Link>

            <HStack spacing={4} wrap='wrap'>
              <CostDay tool={tool} />
              {tool?.cost > 0 && <Earned booking={booking} cost={tool?.cost} isRequest={isRequest} />}
            </HStack>

            <Text fontSize='md' title={tool.description} sx={lightText}>
              {tool.description}
            </Text>
          </Stack>
        </Flex>
      </CardBody>
    </Card>
  )
}

// Component for displaying booking dates
const BookingDateInfo = ({ booking }: { booking: Booking }) => {
  const { t } = useTranslation()

  return (
    <Card variant='bookingDetail'>
      <CardHeader>
        <HStack spacing={2}>
          <Icon as={FaRegCalendarAlt} />
          <Text fontWeight='medium'>{t('bookings.dates', { defaultValue: 'Dates' })}</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <BookingDates booking={booking} />
      </CardBody>
    </Card>
  )
}

// Custom component for dynamic booking title based on timing
const DynamicBookingTitle = ({ booking, isRequest }: { booking: Booking; isRequest: boolean }) => {
  const { t } = useTranslation()
  const now = new Date().getTime() / 1000 // Current time in seconds
  const startDate = booking.startDate // Already in seconds
  const endDate = booking.endDate // Already in seconds

  // Determine booking timing status
  const title = useMemo(() => {
    let text = isRequest ? t('bookings.tool_request_title') : t('bookings.tool_petition_title')
    if (booking.bookingStatus === BookingStatus.RETURNED) {
      text = isRequest ? t(`bookings.tool_request_past_title`) : t(`bookings.tool_petition_past_title`)
    } else if (booking.bookingStatus === BookingStatus.REJECTED || booking.bookingStatus === BookingStatus.CANCELLED) {
      text = isRequest ? t(`bookings.tool_request_cancelled_title`) : t(`bookings.tool_petition_cancelled_title`)
    } else if (now < startDate) {
      text = isRequest ? t('bookings.tool_request_future_title') : t('bookings.tool_petition_future_title')
    } else if (now >= startDate && now <= endDate) {
      text = isRequest ? t(`bookings.tool_request_present_title`) : t(`bookings.tool_petition_present_title`)
    }
    return text
  }, [booking, now])

  return (
    <HStack sx={lighterText} fontSize={{ base: 'xl', md: '2xl' }} fontWeight='bold'>
      <Icon as={isRequest ? icons.outbox : icons.inbox} />
      <Text>{title}</Text>
    </HStack>
  )
}

// Component to display booking ratings
const BookingRatings = ({ booking }: { booking: Booking }) => {
  const { t } = useTranslation()
  const { user } = useAuth()

  // Fetch ratings for this specific booking
  const { data: bookingRatings, isLoading } = useGetBookingRatings(booking.id)

  // If the booking has no ratings and is not in RETURNED status, don't show anything
  if (booking.bookingStatus !== BookingStatus.RETURNED && (!bookingRatings || bookingRatings.length === 0)) {
    return null
  }

  // Convert BookingRating[] to UnifiedRating format for RatingComments component
  const createUnifiedRating = useMemo(() => {
    if (!bookingRatings || bookingRatings.length === 0) return null

    // Group ratings by user role (owner/requester)
    const ownerRating = bookingRatings.find((r) => r.fromUserId === booking.toUserId)
    const requesterRating = bookingRatings.find((r) => r.fromUserId === booking.fromUserId)

    return {
      id: booking.id,
      bookingId: booking.id,
      owner: {
        id: booking.toUserId,
        rating: ownerRating?.rating || null,
        ratingComment: ownerRating?.comment || null,
        ratedAt: ownerRating?.ratedAt || null,
        images: ownerRating?.images || null,
      },
      requester: {
        id: booking.fromUserId,
        rating: requesterRating?.rating || null,
        ratingComment: requesterRating?.comment || null,
        ratedAt: requesterRating?.ratedAt || null,
        images: requesterRating?.images || null,
      },
    } as UnifiedRating
  }, [bookingRatings, booking])

  return (
    <Card variant='bookingDetail'>
      <CardHeader>
        <HStack spacing={2}>
          <Icon as={icons.ratings} />
          <Text fontWeight='medium'>{t('rating.ratings')}</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <Flex justify='center' py={4}>
            <Spinner />
          </Flex>
        ) : createUnifiedRating ? (
          <RatingComments {...createUnifiedRating} />
        ) : booking.ratings && booking.ratings.length > 0 ? (
          // Fallback to use ratings directly from booking object if available
          <Box>
            {booking.ratings.map((rating, index) => (
              <Box key={rating.id || index} mb={2}>
                <HStack>
                  <Text fontWeight='bold'>
                    {rating.fromUserId === user.id ? t('rating.you_lent') : t('rating.you_got')}
                  </Text>
                </HStack>
                <Box pl={4}>
                  <Text>{rating.ratingComment}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Text color='gray.500'>{t('rating.no_ratings_history_desc')}</Text>
        )}
      </CardBody>
    </Card>
  )
}

// Improved BookingDetailsPage component for standalone page
export const BookingDetailsPage = ({ booking, tool, userId }: BookingDetailsProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const isRequest = booking.toUserId === user.id
  const headerBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <BookingActionsProvider>
      <Container maxW='container.xl' p={0}>
        {/* Header with Status */}
        <Box mb={6} p={4} borderColor={borderColor} borderBottom={'1px'} borderBottomColor={borderColor}>
          <Flex justify='space-between' align='center' wrap={{ base: 'wrap', md: 'nowrap' }} gap={3}>
            <Stack spacing={1}>
              <DynamicBookingTitle isRequest={isRequest} booking={booking} />
              <Text fontSize='sm' color='gray.500' _dark={{ color: 'gray.400' }}>
                {t('bookings.reference', { id: booking.id })}
              </Text>
            </Stack>
            <StatusBadge status={booking.bookingStatus} />
          </Flex>
        </Box>

        {/* Main Content */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Left Column */}
          <Stack spacing={6}>
            <BookingComments booking={booking} />
            <BookingDateInfo booking={booking} />
            <UserInfo userId={userId} />

            {/* Add Ratings section */}
            {booking.bookingStatus === BookingStatus.RETURNED && <BookingRatings booking={booking} />}
          </Stack>

          {/* Right Column */}
          <Stack spacing={6}>
            <ToolInfo tool={tool} booking={booking} isRequest={isRequest} />

            {/* Actions Card */}
            <Card variant='bookingDetail'>
              <CardHeader>
                <HStack spacing={2}>
                  <Icon as={icons.tools} />
                  <Text fontWeight='medium'>{t('bookings.actions', { defaultValue: 'Actions' })}</Text>
                </HStack>
              </CardHeader>
              <CardBody>
                <Flex justify='flex-end' gap={4} wrap='wrap'>
                  <ActionButtons booking={booking} type={booking.fromUserId === userId ? 'petition' : 'request'} />
                </Flex>
              </CardBody>
            </Card>
          </Stack>
        </SimpleGrid>
      </Container>
    </BookingActionsProvider>
  )
}
