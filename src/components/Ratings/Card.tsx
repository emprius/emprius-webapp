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
    <Box
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      transition='all 0.2s'
      _hover={{ shadow: 'lg' }}
      position='relative'
    >
      <Skeleton
        isLoaded={!!tool}
        position='absolute'
        top={2}
        right={2}
        width='50px'
        height='50px'
        borderRadius='md'
        overflow='hidden'
      >
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
      <Box px={{ base: 2, md: 4 }} py={{ base: 3, md: 5 }}>
        <VStack align='start' spacing={2} pl={2}>
          <Box mr={'50px'} display={'flex'}>
            <Box fontSize='sm'>
              {titleText}
              {tool && (
                <Link pl={1} as={RouterLink} to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}>
                  {tool.title}
                </Link>
              )}
            </Box>
            {!tool && <Skeleton ml={1} isLoaded={!!tool} w={10} h={4} mt={1} />}
          </Box>

          <UserCard userId={userId} py={0} pl={0} borderWidth={0} showRating={false} avatarSize={'md'} />

          <ShowRatingStars rating={(rating.rating * 100) / 5} size='md' showCount={false} />

          {rating.ratingComment && (
            <Box bg='gray.100' p={3} borderRadius='md' mt={2} w={'full'}>
              <Flex align='start' gap={2}>
                <Icon as={icons.messageBubble} mt={1} color='gray.500' />
                <Text fontSize='sm' color='gray.600'>
                  {rating.ratingComment}
                </Text>
              </Flex>
            </Box>
          )}

          <Flex width='100%' justify='flex-end'>
            <Button leftIcon={<Icon as={FaInfoCircle} />} size='sm' variant='outline' onClick={onOpen}>
              {t('common.details')}
            </Button>
          </Flex>
        </VStack>
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
    </Box>
  )
}
