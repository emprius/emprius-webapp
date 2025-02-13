import { Badge, Box, Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FaArrowRight, FaRegCalendarAlt } from 'react-icons/fa'
import { ServerImage } from '~components/Images/ServerImage'
import { RatingsForm } from '~components/Ratings/Form'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { useTool } from '~components/Tools/queries'
import { UserCard } from '~components/Users/Card'
import { Rating } from './types'

export const RatingCardHeader = ({ rating }: { rating: Rating }) => {
  const { t } = useTranslation()
  const { data: tool } = useTool(rating.toolId)
  const datef = t('rating.datef')
  return (
    <>
      {tool && (
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'stretch' }} gap={4}>
          {tool.images?.[0] && (
            <Box width='100px' height='100px' flexShrink={0} borderRadius='md' overflow='hidden'>
              <ServerImage imageId={tool.images[0]} alt={tool.title} width='100%' height='100%' objectFit='cover' />
            </Box>
          )}
          <VStack align='start'>
            <Heading size='md' noOfLines={2}>
              {tool.title}
            </Heading>
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
      )}
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

export const RatingCard = (rating: Rating) => {
  const isPending = !rating.isRated

  return (
    <Box borderWidth='1px' borderRadius='lg' overflow='hidden' transition='all 0.2s' _hover={{ shadow: 'lg' }}>
      {isPending ? (
        <RatingsForm rating={rating} />
      ) : (
        <Box px={{ base: 2, md: 4 }} py={{ base: 3, md: 5 }}>
          <RatingCardHeader rating={rating} />
          <Box mt={2}>
            <ShowRatingStars rating={(rating.rating * 100) / 5} size='md' showCount={false} />
            {rating.ratingComment && (
              <Text mt={2} fontSize='sm' color='gray.600'>
                "{rating.ratingComment}"
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}
