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
  const bubbleColor = useColorModeValue(isAuthor ? 'blue.50' : 'gray.100', isAuthor ? 'blue.800' : 'gray.700')
  const textColor = useColorModeValue(isAuthor ? 'gray.800' : 'gray.700', isAuthor ? 'gray.100' : 'gray.200')
  const dateColor = useColorModeValue(isAuthor ? 'gray.500' : 'gray.400', isAuthor ? 'gray.400' : 'gray.500')
  const datef = t('rating.datef_full')

  if (!rating) return null

  return (
    <Flex
      justify={{ base: isAuthor ? 'start' : 'end', lg: 'start' }}
      mb={4}
      gap={2}
      direction={isAuthor ? 'row' : 'row-reverse'}
      {...flexProps}
    >
      <UserAvatar userId={id} size='sm' linkProfile />
      <VStack
        bg={bubbleColor}
        p={3}
        borderRadius='lg'
        borderTopRightRadius={!isAuthor ? 0 : 'lg'}
        borderTopLeftRadius={isAuthor ? 0 : 'lg'}
        boxShadow='sm'
        align={isAuthor ? 'start' : 'end'}
      >
        <ShowRatingStars
          rating={(rating * 100) / 5}
          size='sm'
          showCount={false}
          pr={isAuthor ? '20px' : 0}
          pl={!isAuthor ? '20px' : 0}
        />
        <VStack spacing={0} w={'full'}>
          {ratingComment && (
            <Text
              fontSize='sm'
              color={textColor}
              alignSelf={isAuthor ? 'start' : 'end'}
              pr={isAuthor ? '10px' : 0}
              pl={!isAuthor ? '10px' : 0}
            >
              {ratingComment}
            </Text>
          )}
          {images && <ImagesGrid images={images} />}
          {ratedAt && (
            <Popover>
              <PopoverTrigger>
                <Text fontSize='xs' color={dateColor} alignSelf={isAuthor ? 'end' : 'start'} cursor='pointer'>
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
      </VStack>
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
