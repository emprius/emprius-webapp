import { Box, Divider, Flex, HStack, Icon, Link, Stack, StackProps, Text, TextProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FiPhone } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { ActionButtons } from '~components/Bookings/Actions'
import { BookingDates } from '~components/Bookings/BookingDates'
import { StatusBadge } from '~components/Bookings/StatusBage'
import { BookingActionsProvider } from '~components/Bookings/ActionsProvider'
import { CostDay } from '~components/Tools/shared/CostDay'
import { ToolImage } from '~components/Tools/shared/ToolImage'
import { Tool } from '~components/Tools/types'
import { UserCard } from '~components/Users/Card'
import { ROUTES } from '~src/router/routes'
import { lighterText, lightText } from '~theme/common'
import { icons } from '~theme/icons'
import { Booking } from './queries'
import { useAuth } from '~components/Auth/AuthContext'
import { BookingTitle, Earned } from '~components/Bookings/Card'

interface BookingDetailsProps {
  booking: Booking
  tool: Tool
  userId: string
}

const BookingComments = ({ booking }: { booking: Booking }) => {
  return (
    <Stack
      spacing={3}
      p={4}
      borderRadius='lg'
      bg='gray.100'
      color='gray.500'
      _dark={{ bg: 'gray.600', color: 'white' }}
    >
      <Stack direction='row' align='center' spacing={2}>
        <Box>
          <FiPhone size={16} />
        </Box>
        <Text fontSize='sm'>{booking.contact}</Text>
      </Stack>
      <BookingComment comments={booking.comments} />
    </Stack>
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
    <Stack direction='row' align='flex-start' spacing={2} {...props}>
      <Box mt={1}>
        <Icon as={icons.messageBubble} size={16} />
      </Box>
      <Text fontSize='sm' {...textProps}>
        {comments}
      </Text>
    </Stack>
  )
}

const UserInfo = ({ userId }: { userId: string }) => {
  const { t } = useTranslation()
  return (
    <Stack spacing={1}>
      <HStack sx={lighterText}>
        <Icon as={icons.user} fontSize='sm' />
        <Text fontSize='sm'>{t('bookings.user_info')}</Text>
      </HStack>
      <Flex align='center' gap={4}>
        <UserCard userId={userId} borderWidth={0} />
      </Flex>
    </Stack>
  )
}

const ToolInfo = ({ tool, booking, isRequest }: { tool: Tool; booking: Booking; isRequest: boolean }) => {
  const { t } = useTranslation()
  const toolDetailUrl = ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())

  return (
    <Stack direction={'row'} spacing={6} align={'start'}>
      {/* Tool Image */}
      <Box flex={'0 0 140px'}>
        <Link as={RouterLink} to={toolDetailUrl}>
          <ToolImage
            imageHash={tool.images[0]}
            tool={tool}
            w={'100%'}
            maxW={'140px'}
            maxH={'160px'}
            minH={'160px'}
            h={'100%'}
          />
        </Link>
      </Box>

      {/* Tool Information */}
      <Stack spacing={3} flex={1}>
        <Stack spacing={1}>
          <HStack sx={lighterText}>
            <Icon as={icons.tools} fontSize='sm' />
            <Text fontSize='sm'>{t('bookings.tool_info')}</Text>
          </HStack>
          <Link
            as={RouterLink}
            to={toolDetailUrl}
            fontSize='xl'
            fontWeight='semibold'
            _hover={{ color: 'primary.500', textDecoration: 'none' }}
          >
            {tool.title}
          </Link>
        </Stack>
        <CostDay tool={tool} />
        {tool?.cost > 0 && <Earned booking={booking} cost={tool?.cost} isRequest={isRequest} />}

        <Text fontSize='md' noOfLines={2} title={tool.description} sx={lightText}>
          {tool.description}
        </Text>
      </Stack>
    </Stack>
  )
}

// New BookingDetailsPage component for standalone page
export const BookingDetailsPage = ({ booking, tool, userId }: BookingDetailsProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const isRequest = booking.toUserId === user.id
  return (
    <BookingActionsProvider>
      <Stack spacing={6}>
        {/* Header with Status */}
        <Flex justify='space-between' align='center'>
          <BookingTitle isRequest={isRequest} fontSize='2xl' fontWeight='bold' sx={{}} />

          <StatusBadge status={booking.bookingStatus} />
        </Flex>

        {/* Contact and Comments */}
        <BookingComments booking={booking} />

        <Divider />

        {/* Booking Dates */}
        <Stack spacing={1}>
          <HStack sx={lighterText}>
            <Icon as={FaRegCalendarAlt} fontSize='sm' />
            <Text fontSize='sm'> {t('bookings.dates', { defaultValue: 'Dates' })}</Text>
          </HStack>
          <BookingDates booking={booking} />
        </Stack>

        <Divider />

        {/* Tool Information */}
        <ToolInfo tool={tool} booking={booking} isRequest={isRequest} />

        <Divider />

        {/* User Information */}
        <UserInfo userId={userId} />

        <Divider />

        {/* Actions */}
        <Flex justify='flex-end' gap={4}>
          <ActionButtons booking={booking} type={booking.fromUserId === userId ? 'petition' : 'request'} />
        </Flex>
      </Stack>
    </BookingActionsProvider>
  )
}
