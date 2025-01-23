import { Badge, Box, Card, CardBody, Flex, HStack, Icon, Link, Skeleton, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FiMessageCircle, FiPhone } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { Booking, BookingStatus } from './bookingsQueries'
import { ToolImage } from '~components/Tools/shared'
import { useTool } from '~components/Tools/toolsQueries'
import { ActionButtons } from '~components/Bookings/BookingActions'
import { useUserProfile } from '~components/User/userQueries'
import React from 'react'
import { DisplayRating } from '~components/Ratings/DisplayRating'
import { Avatar } from '~components/Images/Avatar'
import { UserMiniCard } from '~components/User/UserMiniCard'
import { ImBoxAdd, ImBoxRemove } from 'react-icons/im'
import { ToolBadges } from '~components/Tools/shared/ToolBadges'
import { ROUTES } from '~src/router/router'

interface BookingDatesProps {
  booking: Booking
  isLoading: boolean
}

const BookingDates = ({ booking, isLoading }: BookingDatesProps) => {
  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton height='24px' width='300px' />
  }

  const begin = new Date(booking.startDate * 1000)
  const end = new Date(booking.endDate * 1000)

  const datef = t('bookings.date_format')

  const date = { begin, end }

  return (
    <Stack spacing={1}>
      <Text fontSize='lg' fontWeight='medium' color='gray.700'>
        {t('bookings.date_range', { date, format: datef })}
      </Text>

      <Text fontSize='md' fontWeight='medium' color='gray.600'>
        {t('bookings.date_range_total', { date, format: datef })}
      </Text>
    </Stack>
  )
}

interface StatusBadgeProps {
  status: BookingStatus
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation()
  let colorScheme = 'yellow'
  switch (status) {
    case BookingStatus.RETURNED:
      colorScheme = 'green'
      break
    case BookingStatus.REJECTED:
    case BookingStatus.CANCELLED:
      colorScheme = 'red'
      break
    case BookingStatus.ACCEPTED:
      colorScheme = 'blue'
      break
    default:
      colorScheme = 'yellow'
  }

  return (
    <Badge
      colorScheme={colorScheme}
      px={3}
      py={1.5}
      borderRadius='full'
      fontSize='sm'
      fontWeight='medium'
      textTransform='uppercase'
      letterSpacing='wide'
    >
      {t(`bookings.status.${status}`)}
    </Badge>
  )
}

interface BookingCommentsProps {
  booking: Booking
  type: BookingCardType
}

const BookingComments = ({ booking, type }: BookingCommentsProps) => {
  const userId = booking.fromUserId
  const isRequest = type === 'request'
  const { data: user, isLoading } = useUserProfile(userId, { enabled: !isRequest })

  const isLoaded = !isLoading && user !== undefined

  return (
    <Flex direction='column' gap={1}>
      <Flex flex={1} gap={1} direction={'row'} align={'end'}>
        <Box w={'full'}>
          <Stack spacing={3} bg='gray.100' p={4} borderRadius='lg'>
            <Stack direction='row' align='center' spacing={2}>
              <Box color='gray.500'>
                <FiPhone size={16} />
              </Box>
              <Text fontSize='sm' color='gray.700'>
                {booking.contact}
              </Text>
            </Stack>
            <Stack direction='row' align='flex-start' spacing={2}>
              <Box color='gray.500' mt={1}>
                <FiMessageCircle size={16} />
              </Box>
              <Text fontSize='sm' color='gray.700'>
                {booking.comments}
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Flex>
      {isRequest && (
        <Flex align='center' justify={'end'} gap={2}>
          <Skeleton flexDirection={'row'} isLoaded={isLoaded}>
            <HStack>
              <Text fontSize='sm' fontWeight='medium'>
                {user?.name}
              </Text>
              {isLoaded && <DisplayRating rating={user.rating} size='sm' ratingCount={user.ratingCount} />}
            </HStack>
          </Skeleton>
          <Skeleton borderRadius='full' isLoaded={isLoaded}>
            <Avatar username={user?.name} avatarHash={user?.avatarHash} size='sm' />
          </Skeleton>
        </Flex>
      )}
    </Flex>
  )
}

export type BookingCardType = 'request' | 'petition'

interface BookingCardProps {
  booking: Booking
  type: BookingCardType
}

export const BookingCard = ({ booking, type }: BookingCardProps) => {
  const { data: tool, isLoading } = useTool(booking.toolId)
  const { t } = useTranslation()

  const isRequest = type === 'request'

  let data = {
    icon: ImBoxAdd,
    title: 'You are requesting a Tool',
  }

  if (isRequest) {
    data = {
      icon: ImBoxRemove,
      title: 'Your tool is needed',
    }
  }

  return (
    <Card variant='outline' shadow='md' _hover={{ shadow: 'lg' }} transition='box-shadow 0.2s'>
      <CardBody pl={4} py={4}>
        <Stack
          mb={4}
          color='gray.600'
          justify={{ base: 'center', md: 'space-between' }}
          direction={{ base: 'column-reverse', md: 'row' }}
        >
          <HStack>
            <Icon as={data.icon} fontSize='xl' />
            <Text fontSize='xl' fontWeight={'extrabold'}>
              {data.title}
            </Text>
          </HStack>
          <Box right={6}>
            <StatusBadge status={booking.bookingStatus} />
          </Box>
        </Stack>

        <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 4 }} align='stretch'>
          {/* Left side - Tool Image */}
          <Box flex={{ base: '1', md: '0 0 350px' }} position='relative'>
            {isLoading ? (
              <Skeleton height='100%' />
            ) : (
              <Box>
                <Link as={RouterLink} to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}>
                  <ToolImage
                    imageHash={tool?.images[0]?.hash}
                    title={tool?.title}
                    isAvailable={tool?.isAvailable}
                    height='100%'
                  />
                </Link>
                {!isRequest && <UserMiniCard userId={booking.toUserId} />}
              </Box>
            )}
          </Box>

          {/* Right side content */}
          <Stack spacing={6} flex='1' position='relative'>
            {/* Booking Summary Section */}
            <Stack spacing={2}>
              {isLoading ? (
                <Skeleton height='24px' width='200px' />
              ) : (
                <Stack spacing={2}>
                  <Stack spacing={3}>
                    <Stack spacing={1}>
                      <Link
                        as={RouterLink}
                        to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}
                        fontWeight='semibold'
                        fontSize='xl'
                        _hover={{ color: 'primary.500', textDecoration: 'none' }}
                      >
                        {tool.title}
                      </Link>
                      {!isRequest && (
                        <HStack>
                          <Text color='gray.600' fontSize='lg' fontWeight='bold'>
                            {t('tools.cost_unit', { cost: tool.cost })}
                          </Text>
                          <ToolBadges tool={tool} />
                        </HStack>
                      )}
                    </Stack>
                  </Stack>
                  <BookingDates booking={booking} isLoading={isLoading} />
                </Stack>
              )}
            </Stack>

            {/* Comments Section */}
            <BookingComments type={type} booking={booking} />

            {/* Action Buttons */}
            <Box mt='auto'>
              <HStack spacing={4} justify='flex-end'>
                <ActionButtons booking={booking} type={type} />
              </HStack>
            </Box>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  )
}
