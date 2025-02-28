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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ImBoxAdd, ImBoxRemove } from 'react-icons/im'
import { Link as RouterLink } from 'react-router-dom'
import { ActionButtons, BookingActionsProvider, useBookingActions } from '~components/Bookings/Actions'
import { BookingDates } from '~components/Bookings/BookingDates'
import { StatusBadge } from '~components/Bookings/StatusBage'
import { useTool } from '~components/Tools/queries'
import { CostDay } from '~components/Tools/shared/CostDay'
import { ToolImage } from '~components/Tools/shared/ToolImage'
import { UserCard } from '~components/Users/Card'
import { ROUTES } from '~src/router/routes'
import { lighterText } from '~theme/common'
import { addDayToDate, getDaysBetweenDates } from '~utils/dates'
import { BookingComment, BookingDetails } from './Details'
import { Booking, BookingStatus } from './queries'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'

export type BookingCardType = 'request' | 'petition'

interface BookingCardProps {
  booking: Booking
  type: BookingCardType
}

// <BookingActionsProvider>

export const BookingCard = (props: BookingCardProps) => (
  <BookingActionsProvider>
    <ProvidedBookingCard {...props} />
  </BookingActionsProvider>
)

const ProvidedBookingCard = ({ booking, type }: BookingCardProps) => {
  const { data: tool, isLoading } = useTool(booking.toolId)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { error } = useBookingActions()

  const isRequest = type === 'request'
  const userId = isRequest ? booking.fromUserId : booking.toUserId

  const cardMinH = '210px'

  // Determine if this booking is new
  // const isNew = useMemo(() => isNewBooking(booking.createdAt), [booking.createdAt])
  const isNew = useMemo(
    () => booking.bookingStatus === BookingStatus.PENDING && type === 'request',
    [booking.createdAt]
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

  return (
    <Card variant={cardVariant}>
      <Stack direction={{ base: 'column', md: 'row' }}>
        <CardHeader p={0}>
          <Box position='relative'>
            <ToolImage
              maxW={{ base: 'full', md: '160px' }}
              minH={{ base: 'inherit', md: cardMinH }}
              objectFit='cover'
              imageHash={tool?.images?.length ? tool?.images[0] : ''}
              tool={tool}
            />
            {/* Status badge for small screens */}
            <Hide above={'md'}>
              <Box position='absolute' top={1} left={1} zIndex={1}>
                <StatusBadge status={booking.bookingStatus} />
              </Box>
            </Hide>
          </Box>
        </CardHeader>
        <CardBody pl={4} py={4} onClick={onOpen} cursor={'pointer'} minH={cardMinH}>
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
                  <CardTitle isRequest={isRequest} />
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
                          <Link
                            as={RouterLink}
                            to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}
                            fontWeight='semibold'
                            fontSize='lg'
                            _hover={{ color: 'primary.500', textDecoration: 'none' }}
                          >
                            <Text
                              fontWeight='semibold'
                              fontSize='lg'
                              _hover={{ color: 'primary.500', textDecoration: 'none' }}
                              noOfLines={2}
                              flex='1'
                            >
                              {tool?.title}
                            </Text>
                          </Link>
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

      {/* Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <CardTitle isRequest={isRequest} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>{tool && <BookingDetails booking={booking} tool={tool} userId={userId} />}</ModalBody>
        </ModalContent>
      </Modal>
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

const CardTitle = ({ isRequest }: { isRequest: boolean }) => {
  const { t } = useTranslation()
  let data = {
    icon: ImBoxAdd,
    title: t('bookings.tool_petition_title', { defaultValue: 'You are requesting a Tool' }),
  }

  if (isRequest) {
    data = {
      icon: ImBoxRemove,
      title: t('bookings.tool_request_title', { defaultValue: 'Your tool is needed' }),
    }
  }
  return (
    <HStack sx={lighterText}>
      <Icon as={data.icon} fontSize='sm' />
      <Text fontSize='sm'>{data.title}</Text>
    </HStack>
  )
}
