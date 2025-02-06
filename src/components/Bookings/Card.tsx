import {
  Box,
  Button,
  Card,
  CardBody,
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
import { useTranslation } from 'react-i18next'
import { FiInfo } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { Booking } from './queries'
import { ToolImage } from '~components/Tools/shared/ToolImage'
import { useTool } from '~components/Tools/queries'
import { ActionButtons } from '~components/Bookings/Actions'
import { ImBoxAdd, ImBoxRemove } from 'react-icons/im'
import { ROUTES } from '~src/router/routes'
import { lighterText } from '~theme/common'
import { UserCard } from '~components/Users/Card'
import { icons } from '~theme/icons'
import { BookingDetails } from './Details'
import { StatusBadge } from '~components/Bookings/StatusBage'
import { BookingDates } from '~components/Bookings/BookingDates'

export type BookingCardType = 'request' | 'petition'

interface BookingCardProps {
  booking: Booking
  type: BookingCardType
}

const UserInfo = ({ userId, isRequest }: { userId: string; isRequest: boolean }) => {
  const { t } = useTranslation()
  return (
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
        gap={2}
        direction={'column'}
        fontSize={'sm'}
        avatarSize={'sm'}
        userId={userId}
        justify={'start'}
        borderWidth={0}
      />
    </Stack>
  )
}

export const BookingCard = ({ booking, type }: BookingCardProps) => {
  const { data: tool, isLoading } = useTool(booking.toolId)
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const isRequest = type === 'request'
  const userId = isRequest ? booking.fromUserId : booking.toUserId

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
        <Stack direction={'row'} spacing={{ base: 4 }} align='stretch'>
          {/* Left side - Tool Image and User Card (on small screens) */}
          <Stack flex={'0 0 140px'} position='relative' spacing={4}>
            <Box>
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
          </Stack>
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
                <>
                  <Stack
                    mt={{ base: 6, sm: 2 }}
                    direction={'row'}
                    spacing={{ base: 2, lg: 4 }}
                    wrap={'wrap'}
                    justify={'space-between'}
                  >
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
                    <Box display={{ base: 'none', sm: 'block' }}>
                      <BookingDates booking={booking} />
                    </Box>
                    {/* User Card - Hidden on small screens, visible on md and up */}
                    <Box display={{ base: 'none', sm: 'block' }} mr={8}>
                      <UserInfo userId={userId} isRequest={isRequest} />
                    </Box>
                  </Stack>
                  <Stack
                    direction={'row'}
                    spacing={3}
                    justify={'end'}
                    wrap={'wrap'}
                    mt={4}
                    display={{ base: 'none', lg: 'flex' }}
                    align={'end'}
                  >
                    <Button leftIcon={<Icon as={FiInfo} />} variant='outline' onClick={onOpen}>
                      {t('bookings.view_details')}
                    </Button>
                    <ActionButtons booking={booking} type={type} />
                  </Stack>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>

        {/* Visible on small screens */}
        <Stack mt={4} spacing={4} display={{ base: 'block', sm: 'none' }}>
          <Box>
            <BookingDates booking={booking} />
          </Box>
          <Box>
            <UserInfo userId={userId} isRequest={isRequest} />
          </Box>
        </Stack>
        <HStack spacing={3} justify={'end'} wrap={'wrap'} mt={4} display={{ base: 'flex', lg: 'none' }}>
          <Button leftIcon={<Icon as={FiInfo} />} variant='outline' onClick={onOpen}>
            {t('bookings.view_details')}
          </Button>
          <ActionButtons booking={booking} type={type} />
        </HStack>
      </CardBody>

      {/* Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack sx={lighterText}>
              <Icon as={data.icon} fontSize='md' />
              <Text fontSize='md'>{data.title}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>{tool && <BookingDetails booking={booking} tool={tool} userId={userId} />}</ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  )
}
