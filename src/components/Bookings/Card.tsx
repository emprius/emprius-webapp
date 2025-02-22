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
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ImBoxAdd, ImBoxRemove } from 'react-icons/im'
import { Link as RouterLink } from 'react-router-dom'
import { ActionButtons } from '~components/Bookings/Actions'
import { BookingDates } from '~components/Bookings/BookingDates'
import { StatusBadge } from '~components/Bookings/StatusBage'
import { useTool } from '~components/Tools/queries'
import { CostDay } from '~components/Tools/shared/CostDay'
import { ToolImage } from '~components/Tools/shared/ToolImage'
import { UserCard } from '~components/Users/Card'
import { ROUTES } from '~src/router/routes'
import { lighterText } from '~theme/common'
import { addDayToDate, getDaysBetweenDates } from '~utils/dates'
import { BookingDetails } from './Details'
import { Booking } from './queries'

export type BookingCardType = 'request' | 'petition'

interface BookingCardProps {
  booking: Booking
  type: BookingCardType
}

export const BookingCard = ({ booking, type }: BookingCardProps) => {
  const { data: tool, isLoading } = useTool(booking.toolId)
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const isRequest = type === 'request'
  const userId = isRequest ? booking.fromUserId : booking.toUserId

  return (
    <Card variant='outline' shadow='md' _hover={{ shadow: 'lg' }} transition='box-shadow 0.2s'>
      <Stack direction={{ base: 'column', md: 'row' }}>
        <CardHeader p={0}>
          <Box position='relative'>
            <ToolImage
              maxW={{ base: 'full', md: '160px' }}
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
        <CardBody pl={4} py={4} onClick={onOpen} cursor={'pointer'}>
          <Stack direction={'row'} spacing={{ base: 4 }} align='stretch'>
            <Stack spacing={0} flex='1' position='relative'>
              {/* Status badge for big screens */}
              <Hide below={'md'}>
                <Box position='absolute' top={-2} right={-3} zIndex={1}>
                  <StatusBadge status={booking.bookingStatus} />
                </Box>
              </Hide>
              {/* Booking Summary Section */}
              <Stack spacing={2}>
                <>
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
                    <Stack direction={'row'} justify={'end'} wrap={'wrap'} align={'end'} mt={2}>
                      <ActionButtons booking={booking} type={type} />
                    </Stack>
                  </Stack>
                </>
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
