import { Box, Divider, Flex, HStack, Icon, Link, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FiMessageCircle, FiPhone } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { Booking } from './queries'
import { Tool } from '~components/Tools/types'
import { lighterText } from '~theme/common'
import { icons } from '~theme/icons'
import { ToolBadges } from '~components/Tools/shared/ToolBadges'
import { ToolImage } from '~components/Tools/shared/ToolImage'
import { ROUTES } from '~src/router/routes'
import { UserCard } from '~components/Users/Card'
import { StatusBadge } from '~components/Bookings/StatusBage'
import { BookingDates } from '~components/Bookings/BookingDates'

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
      <Stack direction='row' align='flex-start' spacing={2}>
        <Box mt={1}>
          <FiMessageCircle size={16} />
        </Box>
        <Text fontSize='sm'>{booking.comments}</Text>
      </Stack>
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

const ToolInfo = ({ tool }: { tool: Tool }) => {
  const { t } = useTranslation()
  const toolDetailUrl = ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())

  return (
    <Stack direction={'row'} spacing={6} align={'start'}>
      {/* Tool Image */}
      <Box flex={'0 0 140px'}>
        <Link as={RouterLink} to={toolDetailUrl}>
          <ToolImage
            imageHash={tool.images[0]}
            title={tool.title}
            isAvailable={tool.isAvailable}
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
        <Stack spacing={2}>
          <HStack wrap={'wrap'}>
            <Text variant={'muted'} fontSize='lg' fontWeight='bold'>
              {t('tools.cost_unit', { cost: tool.cost })}
            </Text>
          </HStack>
          <ToolBadges tool={tool} />
        </Stack>
      </Stack>
    </Stack>
  )
}

export const BookingDetails = ({ booking, tool, userId }: BookingDetailsProps) => {
  const { t } = useTranslation()
  return (
    <Stack spacing={6}>
      {/* Header with Status */}
      <Flex justify='space-between' align='center'>
        <Text fontSize='xl' fontWeight='bold'>
          {t('common.details')}
        </Text>
        <StatusBadge status={booking.bookingStatus} />
      </Flex>

      {/* Contact and Comments */}
      <BookingComments booking={booking} />

      <Divider />

      {/* Booking Dates */}
      <BookingDates booking={booking} />

      <Divider />

      {/* Tool Information */}
      <ToolInfo tool={tool} />

      <Divider />

      {/* User Information */}
      <UserInfo userId={userId} />
    </Stack>
  )
}
