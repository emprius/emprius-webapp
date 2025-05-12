import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
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
import { StyledCalendar } from '~components/Layout/StyledCalendar'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FiPhone } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { ActionButtons } from '~components/Bookings/Actions'
import { BookingStatusTitle } from '~components/Bookings/BookingDates'
import { BookingBadges } from '~components/Bookings/StatusBage'
import { BookingActionsProvider, useBookingActions } from '~components/Bookings/ActionsProvider'
import { CostDay } from '~components/Tools/shared/CostDay'
import { ToolImageAvailability } from '~components/Tools/shared/ToolImage'
import { Tool } from '~components/Tools/types'
import { UserCard } from '~components/Users/Card'
import { ROUTES } from '~src/router/routes'
import { lighterText, lightText } from '~theme/common'
import { icons } from '~theme/icons'
import { useAuth } from '~components/Auth/AuthContext'
import { Earned } from '~components/Bookings/Card'
import { RatingComments } from '~components/Ratings/RatingComments'
import { useGetBookingRatings } from '~components/Ratings/queries'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'
import ToolTitle from '~components/Tools/shared/ToolTitle'
import { Booking, BookingStatus } from '~components/Bookings/types'
import { ElementNotFound } from '~components/Layout/ElementNotFound'

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
          {booking.comments && <BookingComment comments={booking.comments} />}
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
const UserInfo = ({ booking }: { booking: Booking }) => {
  const { t } = useTranslation()
  const { fromUserId, toUserId } = booking

  let owner = t('bookings.owner')
  let ownerDesc = t('bookings.owner_desc')
  if (booking.isNomadic) {
    owner = t('bookings.nomadic_owner', { defaultValue: 'Holder' })
    ownerDesc = t('bookings.nomadic_owner_desc', { defaultValue: 'Holder of the tool at booking moment' })
  }

  return (
    <Card variant='bookingDetail'>
      <CardHeader>
        <HStack spacing={2}>
          <Icon as={icons.user} />
          <Text fontWeight='medium'>{t('bookings.users_info')}</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          {/* Requester */}
          <Box>
            <Text fontWeight='medium' mb={2} color='primary.500'>
              {t('bookings.requester')}{' '}
              <Text as='span' fontWeight='normal' color='gray.500' fontSize='sm'>
                ({t('bookings.requester_desc')})
              </Text>
            </Text>
            <UserCard userId={fromUserId} borderWidth={0} p={0} />
          </Box>

          <Divider />

          {/* Owner */}
          <Box>
            <Text fontWeight='medium' mb={2} color='primary.500'>
              {owner}{' '}
              <Text as='span' fontWeight='normal' color='gray.500' fontSize='sm'>
                ({ownerDesc})
              </Text>
            </Text>
            <UserCard userId={toUserId} borderWidth={0} p={0} />
          </Box>
        </Stack>
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
              _hover={{ color: 'primary.500' }}
            >
              <ToolTitle tool={tool} />
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

  // Convert booking dates to Date objects for the calendar
  const startDate = new Date(booking.startDate * 1000)
  const endDate = new Date(booking.endDate * 1000)

  const selectedRange: [Date, Date] = [startDate, endDate]

  return (
    <Card variant='bookingDetail'>
      <CardHeader>
        <HStack spacing={2}>
          <Icon as={FaRegCalendarAlt} />
          <Text fontWeight='medium'>{t('bookings.dates', { defaultValue: 'Dates' })}</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        {/* Display the calendar with the booking date range */}
        <Box mb={3}>
          <StyledCalendar
            selectedRange={selectedRange}
            isSelectable={false}
            value={selectedRange[0]}
            calendarWrapperProps={{
              maxW: '450px',
              m: '0 auto',
            }}
          />
        </Box>
      </CardBody>
    </Card>
  )
}

// Component to display booking ratings
const BookingRatings = ({ booking }: { booking: Booking }) => {
  const { t } = useTranslation()

  // Fetch ratings for this specific booking
  const { data, isLoading, isFetched } = useGetBookingRatings(booking.id)

  // If the booking has no ratings and is not in RETURNED status, don't show anything
  if (booking.bookingStatus !== BookingStatus.RETURNED && booking.bookingStatus !== BookingStatus.PICKED) {
    return null
  }

  const noRatings = isFetched && !data?.owner?.rating && !data?.requester?.rating

  return (
    <Card variant='bookingDetail'>
      <CardHeader>
        <HStack spacing={2}>
          <Icon as={icons.ratings} />
          <Text fontWeight='medium'>{t('rating.ratings')}</Text>
        </HStack>
      </CardHeader>
      <CardBody>
        {isLoading && (
          <Flex justify='center' py={4}>
            <Spinner />
          </Flex>
        )}
        {!isLoading && data && <RatingComments {...data} />}
        {!isLoading && noRatings && (
          <ElementNotFound
            title={t('rating.no_ratings_yet', { defaultValue: 'No ratings yet' })}
            desc={t('rating.no_ratings_history_desc')}
            py={4}
          />
        )}
      </CardBody>
    </Card>
  )
}

/* Actions Card - Only show if the authenticated user is not involved in the booking */
const ActionsWrapper = ({ booking, userId }: { booking: Booking; userId: string }) => {
  const { user } = useAuth()
  const { error } = useBookingActions()
  // Check if the authenticated user is involved in the booking
  const isUserInvolved = user.id === booking.fromUserId || user.id === booking.toUserId

  if (!isUserInvolved) {
    return null
  }

  return (
    <>
      <Flex justify='flex-start' gap={4}>
        <ActionButtons booking={booking} type={booking.fromUserId === userId ? 'petition' : 'request'} />
      </Flex>
      {!!error && (
        <Stack direction={{ base: 'column', md: 'row' }} alignSelf={'end'}>
          <FormSubmitMessage isError={!!error} error={error} />
        </Stack>
      )}
    </>
  )
}
// Improved BookingDetailsPage component for standalone page
export const BookingDetailsPage = ({ booking, tool, userId }: BookingDetailsProps) => {
  const { user } = useAuth()
  const { t } = useTranslation()
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
              <BookingStatusTitle isRequest={isRequest} booking={booking} fontWeight='bold' />
              <Text fontSize='sm' sx={lighterText}>
                {t('bookings.reference', { id: booking.id })}
              </Text>
            </Stack>
            <BookingBadges status={booking.bookingStatus} isNomadic={booking.isNomadic} />
          </Flex>
        </Box>
        <Box mb={6}>
          <ActionsWrapper booking={booking} userId={userId} />
        </Box>
        {booking.isNomadic && (
          <Flex direction={'column'} gap={1} mb={6}>
            <Stack direction='row' align='center'>
              <Icon sx={lightText} as={icons.nomadic} />
              <Text sx={lightText}>{t('tools.this_tool_is_nomadic', { defaultValue: 'This tool is nomadic' })}</Text>
            </Stack>
            <Text sx={lighterText}>{t('tools.nomadic_description')}</Text>
          </Flex>
        )}
        {/* Main Content */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Left Column */}
          <Stack spacing={6}>
            <BookingDateInfo booking={booking} />
            <BookingComments booking={booking} />

            {/* Add Ratings section */}
            {(booking.bookingStatus === BookingStatus.RETURNED || booking.bookingStatus === BookingStatus.PICKED) && (
              <BookingRatings booking={booking} />
            )}
          </Stack>

          {/* Right Column */}
          <Stack spacing={6}>
            <ToolInfo tool={tool} booking={booking} isRequest={isRequest} />
            <UserInfo booking={booking} />
          </Stack>
        </SimpleGrid>
      </Container>
    </BookingActionsProvider>
  )
}
