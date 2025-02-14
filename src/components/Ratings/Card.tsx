import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Skeleton,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaArrowRight, FaInfoCircle, FaRegCalendarAlt } from 'react-icons/fa'
import { Link as RouterLink } from 'react-router-dom'
import { BookingDetails } from '~components/Bookings/Details'
import { ServerImage } from '~components/Images/ServerImage'
import { RatingsForm } from '~components/Ratings/Form'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { useTool } from '~components/Tools/queries'
import { UserCard } from '~components/Users/Card'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'
import { Rating } from './types'

export const RatingCardHeader = ({ rating }: { rating: Rating }) => {
  const { t } = useTranslation()
  const { data: tool } = useTool(rating.toolId)
  const datef = t('rating.datef')
  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'stretch' }} gap={4}>
        <Skeleton isLoaded={!!tool} width='100px' height='100px' flexShrink={0} borderRadius='md'>
          {tool?.images?.[0] && (
            <Box width='100px' height='100px' flexShrink={0} borderRadius='md' overflow='hidden'>
              <ServerImage
                imageId={tool.images[0]}
                alt={tool.title}
                width='100%'
                height='100%'
                objectFit='cover'
                thumbnail
              />
            </Box>
          )}
        </Skeleton>
        <VStack align='start'>
          <Skeleton isLoaded={!!tool}>
            <Heading size='md' noOfLines={2}>
              {tool?.title}
            </Heading>
          </Skeleton>
          <Badge px={2} py={1} borderRadius='full'>
            <Flex align='center' wrap='wrap' fontSize='sm' fontWeight='medium'>
              <Icon as={FaRegCalendarAlt} mr={1} mt={1} />
              {t('rating.date_formatted', { date: rating.startDate * 1000, format: datef })}
              <Icon as={FaArrowRight} mx={2} />
              {t('rating.date_formatted', { date: rating.endDate * 1000, format: datef })}
            </Flex>
          </Badge>
        </VStack>
      </Flex>
      <UserCard
        direction='row'
        avatarSize='sm'
        userId={rating.toUserId}
        gap={2}
        p={0}
        fontSize='sm'
        borderWidth={0}
        mt={4}
      />
    </>
  )
}

export const PendingRatingCard = (rating: Rating) => {
  const isPending = !rating.isRated

  if (!isPending) return null

  return (
    <Box borderWidth='1px' borderRadius='lg' overflow='hidden' transition='all 0.2s' _hover={{ shadow: 'lg' }}>
      <RatingsForm rating={rating} />
    </Box>
  )
}

export const RatingCard = ({ rating, userId }: { rating: Rating; userId: string }) => {
  const { t } = useTranslation()
  const { data: tool } = useTool(rating.toolId)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isSent = rating.fromUserId === userId
  let titleText = t('rating.you_got_the_tool_from', { defaultValue: 'You requested' })
  if (isSent) {
    titleText = t('rating.you_lent_the_tool', { defaultValue: 'You lent' })
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

          <Box flex='1'>
            <Flex justify='space-between' align='start' mb={2} direction={{ base: 'column', sm: 'row' }} gap={2}>
              <Box>
                <Box fontSize='sm' mb={1}>
                  {titleText}
                  {tool && (
                    <Link pl={1} as={RouterLink} to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}>
                      {tool.title}
                    </Link>
                  )}
                  {!tool && <Skeleton ml={1} isLoaded={!!tool} w={10} h={4} display='inline-block' />}
                </Box>
                <UserCard userId={userId} py={0} pl={0} borderWidth={0} showRating={false} avatarSize={'sm'} />
              </Box>
              <ShowRatingStars rating={(rating.rating * 100) / 5} size='md' showCount={false} />
            </Flex>

            {rating.ratingComment && (
              <Box bg='gray.50' p={3} borderRadius='md' mb={2}>
                <Flex align='start' gap={2}>
                  <Icon as={icons.messageBubble} mt={1} color='gray.500' flexShrink={0} />
                  <Text fontSize='sm' color='gray.600'>
                    {rating.ratingComment}
                  </Text>
                </Flex>
              </Box>
            )}

            <Flex justify='flex-end'>
              <Button leftIcon={<Icon as={FaInfoCircle} />} size='sm' variant='ghost' onClick={onOpen}>
                {t('common.details')}
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>

      {/* Booking Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody py={6}>
            <BookingDetails booking={rating} tool={tool} userId={isSent ? rating.toUserId : rating.fromUserId} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
