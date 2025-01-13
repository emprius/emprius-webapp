import { Badge, Box, Button, HStack, Link, Stack, Text, useColorModeValue, Avatar as ChakraAvatar } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiStar, FiThumbsDown, FiThumbsUp } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useTool } from '~src/hooks/queries'
import { Booking } from '~src/types'
import { useUpdateBookingStatus, useUserProfile } from '../userQueries'

interface BookingCardProps {
  booking: Booking
  type: 'request' | 'petition'
  onRateClick: (bookingId: string, toolId: string) => void
}

export const BookingCard = ({ booking, type, onRateClick }: BookingCardProps) => {
  const { t } = useTranslation()

  const { data: toUser, isLoading: isLoadingToUser } = useUserProfile(booking.toUserId)
  const { data: fromUser, isLoading: isLoadingFromUser } = useUserProfile(booking.fromUserId)
  const { data: tool, isLoading: isLoadingTool } = useTool(booking.toolId)

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
      <Stack spacing={4}>
        {isLoading ? (
          <Stack spacing={4}>
            <Box height="20px" width="200px" bg="gray.200" borderRadius="md" />
            <Box height="24px" width="100px" bg="gray.200" borderRadius="full" />
          </Stack>
        ) : (
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            justify='space-between'
            align={{ base: 'flex-start', sm: 'center' }}
          >
            {tool ? (
              <Link
                as={RouterLink}
                to={`/tools/${tool.id}`}
                fontWeight='semibold'
                fontSize='lg'
                _hover={{ color: 'primary.500', textDecoration: 'none' }}
              >
                {tool.title}
              </Link>
            ) : (
              <Text fontWeight='semibold' fontSize='lg'>
                {t('bookings.toolNotFound')}
              </Text>
            )}
            <Badge
              colorScheme={
                booking.bookingStatus === 'completed'
                  ? 'green'
                  : booking.bookingStatus === 'cancelled'
                    ? 'red'
                    : booking.bookingStatus === 'confirmed'
                      ? 'blue'
                      : 'yellow'
              }
              px={2}
              py={1}
              borderRadius='full'
            >
              {t(`bookings.status.${booking.bookingStatus}`)}
            </Badge>
          </Stack>
        )}

        {/* User Information */}
        {isLoading ? (
          <HStack spacing={4}>
            <Box height="32px" width="32px" bg="gray.200" borderRadius="full" />
            <Stack spacing={2}>
              <Box height="16px" width="120px" bg="gray.200" borderRadius="md" />
              <Box height="14px" width="80px" bg="gray.200" borderRadius="md" />
            </Stack>
          </HStack>
        ) : (
          type === 'request' ? (
            fromUser && (
              <HStack spacing={4}>
                <ChakraAvatar name={fromUser.name} size='sm' />
                <Stack spacing={0}>
                  <Text fontWeight='medium'>{fromUser.name}</Text>
                  <Text fontSize='sm' color='gray.500'>
                    {t('user.rating')}: {fromUser.rating} ({fromUser.ratingCount})
                  </Text>
                </Stack>
              </HStack>
            )
          ) : (
            toUser && (
              <HStack spacing={4}>
                <ChakraAvatar name={toUser.name} size='sm' />
                <Stack spacing={0}>
                  <Text fontWeight='medium'>{toUser.name}</Text>
                  <Text fontSize='sm' color='gray.500'>
                    {t('user.rating')}: {toUser.rating} ({toUser.ratingCount})
                  </Text>
                </Stack>
              </HStack>
            )
          )
        )}

        {/* Booking Details */}
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} color='gray.600'>
          <Text>
            {new Date(booking.startDate * 1000).toLocaleDateString()} -{' '}
            {new Date(booking.endDate * 1000).toLocaleDateString()}
          </Text>
          {!isLoading && tool && (
            <Text fontWeight='medium'>
              {t('tools.pricePerDay')}: {tool.cost}€
            </Text>
          )}
        </Stack>

        {/* Comments */}
        {booking.comments && (
          <Text color='gray.600'>
            <Text as='span' fontWeight='medium'>
              {t('bookings.comments')}:
            </Text>{' '}
            {booking.comments}
          </Text>
        )}

        {/* Contact Info */}
        {booking.contact && (
          <Text color='gray.600'>
            <Text as='span' fontWeight='medium'>
              {t('bookings.contact')}:
            </Text>{' '}
            {booking.contact}
          </Text>
        )}

        {/* Action Buttons */}
        <HStack spacing={4}>
          {booking.bookingStatus === 'pending' && type === 'request' && (
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
          {booking.bookingStatus === 'completed' && !isLoading && tool && (
            <Button leftIcon={<FiStar />} variant='outline' onClick={() => onRateClick(booking.id, booking.toolId)}>
              {t('rating.rateTool')}
            </Button>
          )}
        </HStack>
      </Stack>
    </Box>
  )
}
