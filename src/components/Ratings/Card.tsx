import {
  Box,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { Trans } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { BookingDetails } from '~components/Bookings/Details'
import { ServerImage } from '~components/Images/ServerImage'
import { RatingsForm } from '~components/Ratings/Form'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { useTool } from '~components/Tools/queries'
import { UserCard } from '~components/Users/Card'
import { ROUTES } from '~src/router/routes'
import { Rating } from './types'
import { Booking, useBookingDetail } from '~components/Bookings/queries'
import { UserAvatar } from '~components/Images/Avatar'

export const PendingRatingCard = (booking: Booking) => {
  return (
    <Box borderWidth='1px' borderRadius='lg' overflow='hidden' transition='all 0.2s' _hover={{ shadow: 'lg' }}>
      <RatingsForm booking={booking} />
    </Box>
  )
}

export const RatingCard = ({ rating }: { rating: Rating }) => {
  const { user } = useAuth()
  const { data: booking } = useBookingDetail({ id: rating.bookingId })
  const { data: tool } = useTool(booking?.toolId, {
    enabled: !!booking?.toolId,
  })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const isSubmitted = rating.fromUserId === user.id
  const isLoan = booking?.toUserId === user.id // toUserId is the owner
  let userId = isSubmitted ? rating.toUserId : rating.fromUserId

  let titleText = (
    <Trans
      i18nKey={'rating.you_got_the_tool_from'}
      defaultValue={'You requested'}
      components={{
        toolName: <ToolName tool={tool} />,
      }}
    />
  )
  if (isLoan) {
    titleText = (
      <Trans
        i18nKey={'rating.you_lent_the_tool'}
        defaultValue={'You lent'}
        components={{
          toolName: <ToolName tool={tool} />,
        }}
      />
    )
  }

  return (
    <>
      <Box width='100%' py={4} borderBottomWidth='1px' _hover={{ bg: 'gray.50' }} transition='background 0.2s'>
        <Flex gap={4} align='start'>
          <Skeleton isLoaded={!!tool} width='80px' height='80px' borderRadius='md' overflow='hidden' flexShrink={0}>
            {tool?.images?.[0] && (
              <ServerImage
                imageId={tool.images[0]}
                alt={tool.title}
                width='100%'
                height='100%'
                objectFit='cover'
                thumbnail
              />
            )}
          </Skeleton>

          <Box flex='1' onClick={onOpen} cursor={'pointer'}>
            <Flex justify='space-between' align='start' mb={2} direction={{ base: 'column', sm: 'row' }} gap={2}>
              <Box>
                <Box fontSize='sm' mb={1}>
                  {titleText}
                </Box>
                <UserCard userId={userId} py={0} pl={0} borderWidth={0} showRating={false} avatarSize={'sm'} />
              </Box>
              <ShowRatingStars rating={(rating.rating * 100) / 5} size='md' showCount={false} />
            </Flex>

            {rating.ratingComment && (
              <Box bg='gray.50' p={3} borderRadius='md' mb={2}>
                <Flex align='start' gap={2}>
                  <Box as={'span'} mt={1}>
                    <UserAvatar userId={rating.fromUserId} size={'2xs'} />
                  </Box>
                  <Text fontSize='sm' color='gray.600'>
                    {rating.ratingComment}
                  </Text>
                </Flex>
              </Box>
            )}
          </Box>
        </Flex>
      </Box>

      {/* Booking Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody py={6}>
            <BookingDetails booking={booking} tool={tool} userId={userId} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const ToolName = ({ tool }) => {
  if (!tool) {
    return <Skeleton ml={1} isLoaded={!!tool} w={10} h={4} display='inline-block' />
  }
  return (
    <Link pl={1} as={RouterLink} to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}>
      {tool.title}
    </Link>
  )
}
