import { useState, useEffect } from 'react';
import { HStack, Icon, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

interface RatingStarsProps {
  initialRating?: number;
  onRatingChange: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars = ({ 
  initialRating = 0, 
  onRatingChange, 
  readonly = false,
  size = 'md'
}: RatingStarsProps) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const starColor = useColorModeValue('yellow.400', 'yellow.200');
  const inactiveColor = useColorModeValue('gray.300', 'gray.600');

  const handleClick = (currentRating: number) => {
    if (readonly) return;
    setRating(currentRating);
    onRatingChange(currentRating);
  };

  const sizes = {
    sm: { fontSize: '1rem', spacing: 0.5 },
    md: { fontSize: '1.5rem', spacing: 1 },
    lg: { fontSize: '2rem', spacing: 2 },
  };

  return (
    <HStack spacing={sizes[size].spacing}>
      {[1, 2, 3, 4, 5].map((star) => {
        const currentRating = readonly ? initialRating : (hover || rating);
        return (
          <IconButton
            key={star}
            size={size}
            variant="ghost"
            icon={
              <Icon
                as={FaStar}
                fontSize={sizes[size].fontSize}
                color={star <= currentRating ? starColor : inactiveColor}
              />
            }
            aria-label={`Rate ${star} stars`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            isDisabled={readonly}
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
            padding={0}
            minWidth="auto"
          />
        );
      })}
    </HStack>
  );
};
