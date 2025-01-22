import { Box } from '@chakra-ui/react'
import { Rating } from './types'
import { RatingForm } from '~components/Ratings/RatingForm'

export const RatingCard = (rating: Rating) => {
  return (
    <Box
      // bg={bgColor}
      borderWidth='1px'
      // borderColor={borderColor}
      borderRadius='lg'
      overflow='hidden'
      transition='all 0.2s'
      _hover={{ shadow: 'lg' }}
    >
      <RatingForm rating={rating} />
    </Box>
  )
}
