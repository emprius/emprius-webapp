import { HStack, Icon, Text, useColorModeValue } from '@chakra-ui/react'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { lightText } from '~theme/common'
import { icons } from '~theme/icons'

interface DisplayRatingProps {
  rating: number
  size?: sizes
  showCount?: boolean
  ratingCount?: number
}

type sizes = 'sm' | 'md' | 'lg'

const sizes = {
  sm: { fontSize: '1rem', spacing: 0.5 },
  md: { fontSize: '1.5rem', spacing: 1 },
  lg: { fontSize: '2rem', spacing: 2 },
}

export const ShowRatingStars = ({ rating, size = 'md', showCount = true, ratingCount }: DisplayRatingProps) => {
  return (
    <HStack spacing={2} wrap={'wrap'}>
      <HStack spacing={sizes[size].spacing}>
        {[0, 1, 2, 3, 4].map((position) => (
          <Star key={position} position={position} rating={rating} size={size} />
        ))}
      </HStack>
      {showCount && (
        <Text fontSize={size === 'sm' ? 'sm' : 'md'} sx={lightText}>
          {rating.toFixed(0)}%{ratingCount !== undefined && ` (${ratingCount})`}
        </Text>
      )}
    </HStack>
  )
}

const Star = ({ rating, position, size }: { rating: number; position: number; size: sizes }) => {
  const starColor = useColorModeValue('yellow.400', 'yellow.200')

  // Convert rating from 0-100 scale to 0-5 scale
  // Uncoment for rating on %
  const normalizedRating = (rating / 100) * 5
  if (normalizedRating >= position + 1) {
    // Full star
    return <Icon as={FaStar} fontSize={sizes[size].fontSize} color={starColor} />
  } else if (normalizedRating > position && normalizedRating < position + 1) {
    // Half star
    return <Icon as={FaStarHalfAlt} fontSize={sizes[size].fontSize} color={starColor} />
  }
  // Empty star
  return <Icon as={icons.ratings} fontSize={sizes[size].fontSize} color={starColor} />
}
