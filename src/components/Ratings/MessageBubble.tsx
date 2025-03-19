import { RatingParty } from '~components/Ratings/types'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Flex,
  FlexProps,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { UserAvatar } from '~components/Images/Avatar'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { convertToDate } from '~utils/dates'
import React from 'react'
import { ServerImage } from '~components/Images/ServerImage'

export type MessageBubbleProps = {
  isAuthor: boolean
} & RatingParty &
  FlexProps

export const MessageBubble = ({
  id,
  ratingComment,
  rating,
  isAuthor,
  images,
  ratedAt,
  ...flexProps
}: MessageBubbleProps) => {
  const { t } = useTranslation()
  const textColor = useColorModeValue(isAuthor ? 'gray.700' : 'gray.800', isAuthor ? 'gray.200' : 'gray.100')
  const dateColor = useColorModeValue(isAuthor ? 'gray.400' : 'gray.500', isAuthor ? 'gray.500' : 'gray.400')
  const datef = t('rating.datef_full')

  if (!rating) return null

  return (
    <Flex
      justify={{ base: isAuthor ? 'end' : 'start', lg: 'start' }}
      mb={4}
      gap={2}
      direction={isAuthor ? 'row-reverse' : 'row'}
      {...flexProps}
    >
      <UserAvatar userId={id} size='sm' linkProfile />
      <Bubble isAuthor={isAuthor}>
        <HStack justify={isAuthor ? 'end' : 'start'} pr={isAuthor ? 0 : '20px'} pl={isAuthor ? 'auto' : 0}>
          <ShowRatingStars rating={(rating * 100) / 5} size='sm' showCount={false} />
        </HStack>
        <VStack spacing={0} w={'full'}>
          {ratingComment && (
            <Text
              fontSize='sm'
              color={textColor}
              alignSelf={isAuthor ? 'end' : 'start'}
              pr={isAuthor ? 0 : '10px'}
              pl={isAuthor ? '10px' : 0}
            >
              {ratingComment}
            </Text>
          )}
          {images && <ImagesGrid images={images} />}
          {ratedAt && (
            <Popover>
              <PopoverTrigger>
                <Text fontSize='xs' color={dateColor} alignSelf={isAuthor ? 'start' : 'end'} cursor='pointer'>
                  {t('rating.rating_date', { date: convertToDate(ratedAt) })}
                </Text>
              </PopoverTrigger>
              <PopoverContent bg='gray.700' color={'white'} maxW={'170px'} py={1}>
                <Box w={'full'} textAlign={'center'}>
                  {t('rating.date_formatted', {
                    date: convertToDate(ratedAt),
                    format: datef,
                  })}
                </Box>
              </PopoverContent>
            </Popover>
          )}
        </VStack>
      </Bubble>
    </Flex>
  )
}
export const ImagesGrid = ({ images }: { images: string[] }) => {
  if (!images) return
  return (
    <HStack wrap={'wrap'} spacing={4}>
      {images.map((image, index) => (
        <Box key={image} position='relative' w={'50px'} h={'50px'}>
          <ServerImage imageId={image} objectFit='cover' w='100%' h='100%' borderRadius='md' thumbnail modal />
        </Box>
      ))}
    </HStack>
  )
}

const Bubble = ({ children, position = 'left', isAuthor }) => {
  const bubbleColor = useColorModeValue(isAuthor ? 'gray.100' : 'blue.50', isAuthor ? 'gray.700' : 'blue.800')
  return (
    <Box>
      <Box
        maxW='400px'
        p={3}
        bg={bubbleColor}
        color='white'
        borderRadius='1em'
        position='relative'
        _before={{
          content: "''",
          position: 'absolute',
          top: '1em',
          left: isAuthor ? 'auto' : '-0.4em',
          right: isAuthor ? '-0.4em' : 'auto',
          width: '1.5em',
          height: '1.5em',
          bg: bubbleColor,
          clipPath: isAuthor ? 'polygon(70% 100%, 100% 0%, 50% 0%)' : 'polygon(30% 100%, 60% 0%, 0% 0%)',
        }}
        alignSelf={position === 'left' ? 'flex-start' : 'flex-end'}
      >
        {children}
      </Box>
    </Box>
  )
}
