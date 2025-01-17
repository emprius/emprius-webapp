import { Badge, Box, Button, Divider, HStack, Link, Skeleton, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiMessageCircle, FiPhone, FiStar, FiThumbsDown, FiThumbsUp } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { Booking, BookingStatus, useUpdateBookingStatus } from '~components/Bookings/bookingsQueries'
import { ToolImage, ToolPriceRating } from '~components/Tools/shared'
import { useTool } from '~components/Tools/toolsQueries'
import { useUserProfile } from '~components/User/userQueries'
import { UserMiniCard } from '~components/User/UserMiniCard'

const ToolInfoCard = ({ toolId, isLoading }: { toolId: string; isLoading: boolean }) => {
  const { data: tool } = useTool(toolId)

  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Stack spacing={4}>
        <Skeleton height='200px' />
        <Skeleton height='20px' width='200px' />
      </Stack>
    )
  }

  if (!tool) {
    return (
      <Text fontWeight='semibold' fontSize='lg'>
        {t('bookings.toolNotFound')}
      </Text>
    )
  }

  return (
    <Box borderRadius='lg' overflow='hidden'>
      <ToolImage imageHash={tool.images[0]?.hash} title={tool.title} isAvailable={tool.isAvailable} height='200px' />
      <Stack p={4} spacing={2}>
        <Link
          as={RouterLink}
          to={`/tools/${tool.id}`}
          fontWeight='semibold'
          fontSize='lg'
          _hover={{ color: 'primary.500', textDecoration: 'none' }}
        >
          {tool.title}
        </Link>
        <ToolPriceRating cost={tool.cost} rating={tool.rating} />
      </Stack>
    </Box>
  )
}

const BookingDates = ({ booking, isLoading }: { booking: Booking; isLoading: boolean }) => {
  if (isLoading) {
    return <Skeleton height='24px' width='300px' />
  }

  return (
    <Text fontSize='lg' fontWeight='medium' color='gray.700'>
      {new Date(booking.startDate * 1000).toLocaleDateString()} -{' '}
      {new Date(booking.endDate * 1000).toLocaleDateString()}
    </Text>
  )
}

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const { t } = useTranslation()

  return (
    <Badge
      colorScheme={
        status === BookingStatus.COMPLETED
          ? 'green'
          : status === BookingStatus.CANCELLED
            ? 'red'
            : status === BookingStatus.CONFIRMED
              ? 'blue'
              : 'yellow'
      }
      px={2}
      py={1}
      borderRadius='full'
    >
      {t(`bookings.status.${status}`)}
    </Badge>
  )
}

const BookingComments = ({ booking }: { booking: Booking }) => {
  const { t } = useTranslation()

  if (!booking.comments && !booking.contact) return null

  return (
    <Stack spacing={4} p={4} bg='gray.50' borderRadius='md'>
      {booking.comments && (
        <Stack direction='row' align='flex-start' spacing={3}>
          <Box color='gray.500' mt={1}>
            <FiMessageCircle size={20} />
          </Box>
          <Stack spacing={1}>
            <Text fontWeight='medium' color='gray.700'>
              {t('bookings.comments')}
            </Text>
            <Text color='gray.600'>{booking.comments}</Text>
          </Stack>
        </Stack>
      )}
      {booking.contact && (
        <Stack direction='row' align='flex-start' spacing={3}>
          <Box color='gray.500' mt={1}>
            <FiPhone size={20} />
          </Box>
          <Stack spacing={1}>
            <Text fontWeight='medium' color='gray.700'>
              {t('bookings.contact')}
            </Text>
            <Text color='gray.600'>{booking.contact}</Text>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

interface BookingCardProps {
  booking: Booking
  type: 'request' | 'petition'
  onRateClick: (bookingId: string, toolId: string) => void
}

export const BookingCard = ({ booking, type, onRateClick }: BookingCardProps) => {
  const { t } = useTranslation()
  const { data: toUser, isLoading: isLoadingToUser } = useUserProfile(booking.toUserId)
  const { data: fromUser, isLoading: isLoadingFromUser } = useUserProfile(booking.fromUserId)
  const { isLoading: isLoadingTool } = useTool(booking.toolId)
  const isLoading = isLoadingTool || isLoadingToUser || isLoadingFromUser
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const updateBookingStatus = useUpdateBookingStatus()

  const handleStatusUpdate = (status: 'confirmed' | 'cancelled') => {
    updateBookingStatus.mutate({
      bookingId: booking.id,
      status,
    })
  }

  return (
    <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor}>
      <Stack spacing={6}>
        {/* Header with Dates and Status */}
        <Stack direction={{ base: 'column', sm: 'row' }} justify='space-between' align='center'>
          <BookingDates booking={booking} isLoading={isLoading} />
          <StatusBadge status={booking.bookingStatus} />
        </Stack>

        {/* Tool Info */}
        <Box>
          <ToolInfoCard toolId={booking.toolId} isLoading={isLoading} />
        </Box>

        {/* User Info and Comments Section */}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
          <Box flex='1'>
            <UserMiniCard userId={type === 'request' ? booking.fromUserId : booking.toUserId} />
          </Box>
          <Box flex='2'>{(booking.comments || booking.contact) && <BookingComments booking={booking} />}</Box>
        </Stack>

        {/* Action Buttons */}
        <Stack>
          <Divider />
          <HStack spacing={4} justify='flex-end'>
            {booking.bookingStatus === BookingStatus.PENDING && type === 'request' && (
              <>
                <Button
                  leftIcon={<FiThumbsUp />}
                  colorScheme='green'
                  variant='outline'
                  onClick={() => handleStatusUpdate('confirmed')}
                >
                  {t('bookings.approve')}
                </Button>
                <Button
                  leftIcon={<FiThumbsDown />}
                  colorScheme='red'
                  variant='outline'
                  onClick={() => handleStatusUpdate('cancelled')}
                >
                  {t('bookings.deny')}
                </Button>
              </>
            )}
            {booking.bookingStatus === BookingStatus.PENDING && type === 'petition' && (
              <Button
                leftIcon={<FiThumbsDown />}
                colorScheme='red'
                variant='outline'
                onClick={() => handleStatusUpdate('cancelled')}
              >
                {t('bookings.cancel')}
              </Button>
            )}
            {booking.bookingStatus === BookingStatus.COMPLETED && !isLoading && (
              <Button leftIcon={<FiStar />} variant='outline' onClick={() => onRateClick(booking.id, booking.toolId)}>
                {t('rating.rateTool')}
              </Button>
            )}
          </HStack>
        </Stack>
      </Stack>
    </Box>
  )
}
