import { Box } from '@chakra-ui/react'
import { Rating } from './types'
import { RatingsForm } from '~components/Ratings/Form'

export const RatingCard = (rating: Rating) => {
  return (
    <Box borderWidth='1px' borderRadius='lg' overflow='hidden' transition='all 0.2s' _hover={{ shadow: 'lg' }}>
      <RatingsForm rating={rating} />
    </Box>
  )
}
