import React from 'react';
import {
  Box,
  HStack,
  Icon,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  isInteractive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeMap = {
  sm: { icon: 4, spacing: 0.5 },
  md: { icon: 6, spacing: 1 },
  lg: { icon: 8, spacing: 2 },
};

export const RatingStars = ({
  rating,
  maxRating = 5,
  size = 'md',
  isInteractive = false,
  onChange,
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  const starColor = useColorModeValue('orange.400', 'orange.300');
  const { icon: iconSize, spacing } = sizeMap[size];

  const handleClick = (newRating: number) => {
    if (isInteractive && onChange) {
      onChange(newRating);
    }
  };

  const handleHover = (newRating: number) => {
    if (isInteractive) {
      setHoverRating(newRating);
    }
  };

  const handleLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  return (
    <HStack spacing={spacing}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const value = index + 1;
        const isActive = value <= (hoverRating || rating);

        return isInteractive ? (
          <IconButton
            key={index}
            size="sm"
            variant="ghost"
            aria-label={`Rate ${value} stars`}
            icon={
              <Icon
                as={isActive ? FaStar : FiStar}
                w={iconSize}
                h={iconSize}
                color={isActive ? starColor : 'gray.300'}
              />
            }
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleHover(value)}
            onMouseLeave={handleLeave}
            _hover={{ bg: 'transparent' }}
          />
        ) : (
          <Box key={index}>
            <Icon
              as={isActive ? FaStar : FiStar}
              w={iconSize}
              h={iconSize}
              color={isActive ? starColor : 'gray.300'}
            />
          </Box>
        );
      })}
    </HStack>
  );
};
