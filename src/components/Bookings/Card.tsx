import { Badge, Box, Card, CardBody, Flex, HStack, Icon, Link, Skeleton, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FiMessageCircle, FiPhone } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { Booking, BookingStatus } from './queries'
import { ToolImage } from '~components/Tools/shared/ToolImage'
import { useTool } from '~components/Tools/queries'
import { ActionButtons } from '~components/Bookings/Actions'
import { useUserProfile } from '~components/Users/queries'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { Avatar } from '~components/Images/Avatar'
import { ImBoxAdd, ImBoxRemove } from 'react-icons/im'
import { FaArrowRight, FaRegCalendarAlt } from 'react-icons/fa'
import { ROUTES } from '~src/router/routes'
import { lighterText, lightText } from '~theme/common'
import { UserCard } from '~components/Users/Card'
import { PropsWithChildren } from 'react'
import { icons } from '~theme/icons'

interface BookingDatesProps {
  booking: Booking
}

const BookingDates = ({ booking }: BookingDatesProps) => {
  const { t } = useTranslation()

  const begin = new Date(booking.startDate * 1000)
  const end = new Date(booking.endDate * 1000)
  const date = { begin, end }
  const datef = t('bookings.datef')

  return (
    <Stack spacing={1}>
      <HStack sx={lighterText}>
        <Icon as={FaRegCalendarAlt} fontSize='sm' />
        <Text fontSize='sm'> {t('bookings.dates', { defaultValue: 'Dates' })}</Text>
      </HStack>
      <Flex align={'center'} fontSize='md' wrap={'wrap'} sx={lightText}>
        {t('bookings.date_formatted', { date: date.begin, format: datef })}
        <Icon as={FaArrowRight} mx={2} />
        {t('bookings.date_formatted', { date: date.end, format: datef })}
      </Flex>

      <Text fontSize='md' fontWeight='medium' sx={lightText}>
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
  let colorScheme = ''
  let text = ''
  switch (status) {
    case BookingStatus.RETURNED:
      colorScheme = 'green'
      text = t(`bookings.status.RETURNED`)
      break
    case BookingStatus.REJECTED:
      text = t(`bookings.status.REJECTED`)
      colorScheme = 'red'
      break
    case BookingStatus.CANCELLED:
      text = t(`bookings.status.CANCELLED`)
      colorScheme = 'red'
      break
    case BookingStatus.ACCEPTED:
      text = t(`bookings.status.ACCEPTED`)
      colorScheme = 'primary'
      break
    case BookingStatus.PENDING:
      text = t(`bookings.status.PENDING`)
      colorScheme = 'yellow'
      break
    default:
      text = BookingStatus.PENDING
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
      {text}
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

  const { data: user, isLoading } = useUserProfile(userId, { enabled: isRequest })

  const isLoaded = !isLoading && user !== undefined

  return (
    <Flex direction='column' gap={1}>
      <Flex flex={1} gap={1} direction={'row'} align={'end'}>
        <Box w={'full'}>
          <Stack
            spacing={3}
            p={4}
            borderRadius='lg'
            sx={{
              bg: 'gray.100',
              color: 'gray.500',
              _dark: {
                bg: 'gray.600',
                color: 'white',
              },
            }}
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
        </Box>
      </Flex>
      {isRequest && (
        <Flex align='center' justify={'end'} gap={2}>
          <Skeleton flexDirection={'row'} isLoaded={isLoaded}>
            <HStack>
              <Text fontSize='sm' fontWeight='medium'>
                {user?.name}
              </Text>
              {isLoaded && <ShowRatingStars rating={user.rating} size='sm' ratingCount={user.ratingCount} />}
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

const TitleAndComponent = ({ title, children }: { title: string } & PropsWithChildren) => (
  <Stack spacing={1}>
    <Text sx={lighterText}>{title}</Text>
    {children}
  </Stack>
)

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
    title: t('bookings.tool_petition_title', { defaultValue: 'You are requesting a Tool' }),
  }

  if (isRequest) {
    data = {
      icon: ImBoxRemove,
      title: t('bookings.tool_request_title', { defaultValue: 'Your tool is needed' }),
    }
  }

  return (
    <Card variant='outline' shadow='md' _hover={{ shadow: 'lg' }} transition='box-shadow 0.2s'>
      <CardBody pl={4} py={4}>
        {/*<Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 4 }} align='stretch'>*/}
        <Stack direction={'row'} spacing={{ base: 4 }} align='stretch'>
          {/* Left side - Tool Image */}
          <Box flex={'0 0 140px'} position='relative'>
            {isLoading ? (
              <Skeleton height='100%' />
            ) : (
              <Box>
                <Link as={RouterLink} to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}>
                  <ToolImage
                    imageHash={tool?.images[0]}
                    title={tool?.title}
                    isAvailable={tool?.isAvailable}
                    w={'100%'}
                    maxW={'140px'}
                    maxH={'160px'}
                    minH={'160px'}
                    h={'100%'}
                  />
                </Link>
              </Box>
            )}
          </Box>
          {/* Right side content */}
          <Stack spacing={0} flex='1' position='relative'>
            <Box position='relative'>
              <Box position='absolute' top={-2} right={-3} zIndex={1}>
                <StatusBadge status={booking.bookingStatus} />
              </Box>
            </Box>
            {/* Booking Summary Section */}
            <Stack spacing={2}>
              {isLoading ? (
                <Skeleton height='24px' width='200px' />
              ) : (
                <Stack mt={1} direction={'row'} spacing={4} wrap={'wrap'} justify={'space-between'}>
                  <Stack spacing={1}>
                    <HStack sx={lighterText}>
                      <Icon as={data.icon} fontSize='sm' />
                      <Text fontSize='sm'>{data.title}</Text>
                    </HStack>
                    <Link
                      as={RouterLink}
                      to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}
                      fontWeight='semibold'
                      fontSize='xl'
                      _hover={{ color: 'primary.500', textDecoration: 'none' }}
                    >
                      {tool.title}
                    </Link>
                    <HStack wrap={'wrap'}>
                      <Text variant={'muted'} fontSize='lg' fontWeight='bold'>
                        {t('tools.cost_unit', { cost: tool.cost })}
                      </Text>
                    </HStack>
                  </Stack>
                  <BookingDates booking={booking} />
                  <Stack spacing={1}>
                    <HStack sx={lighterText}>
                      <Icon as={icons.user} fontSize='sm' />
                      <Text fontSize='sm'>
                        {isRequest
                          ? t('bookings.tool_requester', { defaultValue: 'Applicant' })
                          : t('bookings.tool_owner', { defaultValue: 'Owner' })}
                      </Text>
                    </HStack>
                    <UserCard
                      p={0}
                      mr={4}
                      gap={2}
                      direction={'column'}
                      fontSize={'sm'}
                      avatarSize={'sm'}
                      userId={isRequest ? booking.fromUserId : booking.toUserId}
                      justify={'start'}
                      borderWidth={0}
                    />
                  </Stack>
                </Stack>
              )}
              <HStack spacing={4} justify={'end'}>
                <ActionButtons booking={booking} type={type} />
              </HStack>
            </Stack>

            {/* Comments Section */}
            {/*<BookingComments type={type} booking={booking} />*/}
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  )
}
