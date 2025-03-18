import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Hide,
  HStack,
  Icon,
  Link,
  Skeleton,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ImBoxAdd, ImBoxRemove } from 'react-icons/im'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { ActionButtons } from '~components/Bookings/Actions'
import { BookingDates } from '~components/Bookings/BookingDates'
import { StatusBadge } from '~components/Bookings/StatusBage'
import { useTool } from '~components/Tools/queries'
import { CostDay } from '~components/Tools/shared/CostDay'
import { ToolImageAvailability } from '~components/Tools/shared/ToolImage'
import { UserCard } from '~components/Users/Card'
import { ROUTES } from '~src/router/routes'
import { lighterText } from '~theme/common'
import { addDayToDate, getDaysBetweenDates } from '~utils/dates'
import { BookingComment } from './Details'
import { Booking, BookingStatus } from './queries'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'
import { BookingActionsProvider, useBookingActions } from '~components/Bookings/ActionsProvider'
import { icons } from '~theme/icons'

export type BookingCardType = 'request' | 'petition'

interface BookingCardProps {
  booking: Booking
  type: BookingCardType
}

export const BookingCard = (props: BookingCardProps) => (
  <BookingActionsProvider>
    <ProvidedBookingCard {...props} />
  </BookingActionsProvider>
)

const ProvidedBookingCard = ({ booking, type }: BookingCardProps) => {
  const { data: tool, isLoading } = useTool(booking.toolId)
  const { error } = useBookingActions()
  const navigate = useNavigate()

  const isRequest = type === 'request'
  const userId = isRequest ? booking.fromUserId : booking.toUserId

  const cardMinH = '210px'

  // Determine if this booking is new
  const isNew = useMemo(
    () => booking.bookingStatus === BookingStatus.PENDING && type === 'request',
    [booking.bookingStatus]
  )

  // Set card styling based on conditions
  const cardVariant = useMemo(() => {
    if (error) {
      return 'error'
    }
    if (isNew) {
      return 'newItem'
    }
    return 'elevatedXl'
  }, [error, isNew])

  const openBooking = () => {
    navigate(ROUTES.BOOKINGS.DETAIL.replace(':id', booking.id), {
      state: { booking, tool, userId },
    })
  }

  return (
    <Card variant={cardVariant}>
      <Stack direction={{ base: 'column', md: 'row' }}>
        <CardHeader p={0}>
          <Box position='relative'>
            <ToolImageAvailability
              maxW={{ base: 'full', md: '160px' }}
              minH={{ base: 'inherit', md: cardMinH }}
              objectFit='cover'
              imageId={tool?.images?.length ? tool?.images[0] : ''}
              isAvailable={tool?.isAvailable}
              isLoading={isLoading}
              toolId={tool?.id}
              alt={tool?.title}
            />
            {/* Status badge for small screens */}
            <Hide above={'md'}>
              <Box position='absolute' top={1} left={1} zIndex={1}>
                <StatusBadge status={booking.bookingStatus} />
              </Box>
            </Hide>
          </Box>
        </CardHeader>
        <CardBody pl={4} py={4} cursor={'pointer'} minH={cardMinH} onClick={openBooking}>
          <Stack direction={'row'} spacing={{ base: 4 }} align='stretch' h={'full'}>
            <Stack spacing={0} flex='1' position='relative' h={'full'}>
              {/* Status badge for big screens */}
              <Hide below={'md'}>
                <Box position='absolute' top={-2} right={-3} zIndex={1}>
                  <StatusBadge status={booking.bookingStatus} />
                </Box>
              </Hide>
              {/* Booking Summary Section */}
              <Stack spacing={1} justify={'space-between'} h={'full'}>
                <Stack spacing={1}>
                  <BookingTitle isRequest={isRequest} />
                  <Stack
                    mt={{ base: 6, sm: 2 }}
                    direction={'row'}
                    spacing={{ base: 2, lg: 4 }}
                    wrap={'wrap'}
                    justify={'space-between'}
                    align={'center'}
                  >
                    {/*tool info*/}
                    {isLoading ? (
                      <Skeleton height='24px' width='200px' />
                    ) : (
                      <Stack spacing={1} maxW={{ base: 'full', lg: '300px' }} w={{ base: 'full', lg: 'inherit' }}>
                        <Flex gap={1} align='top' justify='space-between' direction={{ base: 'row', lg: 'column' }}>
                          <Text fontWeight='semibold' fontSize='lg' noOfLines={2} flex='1' color='primary.500'>
                            {tool?.title}
                          </Text>
                          <CostDay tool={tool} />
                        </Flex>

                        {tool?.cost > 0 && <Earned booking={booking} cost={tool?.cost} isRequest={isRequest} />}
                      </Stack>
                    )}
                    {/*Dates*/}
                    <BookingDates booking={booking} />
                    {/* User Card - Hidden on small screens, visible on md and up */}
                    <UserCard
                      p={0}
                      gap={2}
                      direction={'column'}
                      fontSize={'sm'}
                      avatarSize={'sm'}
                      userId={userId}
                      justify={'start'}
                      borderWidth={0}
                    />
                  </Stack>
                </Stack>
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  justify={'space-between'}
                  align={{ base: 'end', md: 'center' }}
                  mt={2}
                  spacing={4}
                >
                  <Box
                    px={4}
                    py={2}
                    borderRadius='lg'
                    bg='gray.100'
                    color='gray.500'
                    _dark={{ bg: 'gray.600', color: 'white' }}
                    flex='1'
                    minW='0'
                  >
                    <BookingComment
                      comments={booking.comments}
                      textProps={{
                        noOfLines: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    />
                  </Box>
                  <Stack direction={'row'} align={'end'} gap={2} wrap={'wrap'}>
                    <ActionButtons booking={booking} type={type} />
                  </Stack>
                </Stack>
                {!!error && (
                  <Stack direction={{ base: 'column', md: 'row' }} alignSelf={'end'}>
                    <FormSubmitMessage isError={!!error} error={error} />
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </CardBody>
      </Stack>
    </Card>
  )
}

export const Earned = ({ booking, cost, isRequest }: { booking: Booking; cost: number; isRequest: boolean }) => {
  const { t } = useTranslation()
  const amount = cost * getDaysBetweenDates(booking.startDate, addDayToDate(booking.endDate))

  return (
    <Text fontSize='sm' sx={lighterText}>
      {isRequest
        ? t('bookings.total_earned', {
            amount,
          })
        : t('bookings.total_spent', {
            amount,
          })}
    </Text>
  )
}

export const BookingTitle = ({ isRequest, ...props }: { isRequest: boolean } & StackProps) => {
  const { t } = useTranslation()
  let data = {
    icon: icons.inbox,
    title: t('bookings.tool_petition_title', { defaultValue: 'You are requesting a Tool' }),
  }

  if (isRequest) {
    data = {
      icon: icons.outbox,
      title: t('bookings.tool_request_title', { defaultValue: 'Your tool is needed' }),
    }
  }
  return (
    <HStack sx={lighterText} fontSize='sm' {...props}>
      <Icon as={data.icon} />
      <Text>{data.title}</Text>
    </HStack>
  )
}
