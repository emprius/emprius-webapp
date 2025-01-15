import { useTranslation } from 'react-i18next'
import { Badge, Box, Flex, Heading, useColorModeValue, VStack } from '@chakra-ui/react'
import { ServerImage } from '../../../components/shared/ServerImage'
import { ASSETS } from '../../../constants'
import { Rating } from '../types'
import { RatingForm } from './RatingForm'

interface RatingCardProps {
  rating: Rating
}

export const RatingCard = ({ rating }: RatingCardProps) => {
  const { t } = useTranslation()

  // todo(konv1): implement this when backend is ready
  // if (!rating.isPending) return null;

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const badgeBg = useColorModeValue('blue.100', 'blue.900')
  const badgeColor = useColorModeValue('blue.800', 'blue.100')

  return (
    <Box
      bg={bgColor}
      borderWidth='1px'
      borderColor={borderColor}
      borderRadius='lg'
      overflow='hidden'
      transition='all 0.2s'
      _hover={{ shadow: 'lg' }}
    >
      <Box p={6}>
        <Flex align='center' mb={4}>
          {rating.thumbnail && (
            <Box width='80px' height='80px' mr={4} borderRadius='md' overflow='hidden' flexShrink={0}>
              <ServerImage
                imageId={rating.thumbnail.hash}
                fallbackSrc={ASSETS.TOOL_FALLBACK}
                alt={rating.title}
                width='100%'
                height='100%'
                objectFit='cover'
              />
            </Box>
          )}
          <VStack align='start' spacing={1} flex={1}>
            <Heading size='md' noOfLines={2}>
              {rating.title}
            </Heading>
            <Badge px={2} py={1} borderRadius='full' bg={badgeBg} color={badgeColor} fontSize='sm' fontWeight='medium'>
              {rating.ratingType === 'USER' ? t('rating.rateUser') : t('rating.rateTool')}
            </Badge>
          </VStack>
        </Flex>

        <Box borderTopWidth='1px' borderColor={borderColor} pt={4} mt={4}>
          <RatingForm bookingId={rating.id} />
        </Box>
      </Box>
    </Box>
  )
}
