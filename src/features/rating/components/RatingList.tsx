import React from 'react';
import {
  Box,
  Stack,
  Text,
  Avatar,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RatingStars } from './RatingStars';
import type { Tool, UserProfile } from '../../../types';

interface Rating {
  rating: number;
  comment: string;
  user?: UserProfile;
  tool?: Tool;
  createdAt?: string;
}

interface RatingListProps {
  ratings: Rating[];
  showUser?: boolean;
  showTool?: boolean;
}

export const RatingList = ({
  ratings,
  showUser = true,
  showTool = false,
}: RatingListProps) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!ratings.length) {
    return (
      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth={1}
        borderColor={borderColor}
        textAlign="center"
      >
        <Text color="gray.600">
          {t('rating.noRatings')}
        </Text>
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      {ratings.map((rating, index) => (
        <Box
          key={index}
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth={1}
          borderColor={borderColor}
        >
          <Stack spacing={4}>
            {showUser && rating.user && (
              <Stack direction="row" align="center" spacing={4}>
                <Avatar
                  size="sm"
                  name={rating.user.name}
                  src={rating.user.avatar}
                />
                <Link
                  as={RouterLink}
                  to={`/users/${rating.user.id}`}
                  fontWeight="medium"
                  _hover={{ color: 'primary.500', textDecoration: 'none' }}
                >
                  {rating.user.name}
                </Link>
              </Stack>
            )}

            {showTool && rating.tool && (
              <Link
                as={RouterLink}
                to={`/tools/${rating.tool.id}`}
                fontWeight="medium"
                _hover={{ color: 'primary.500', textDecoration: 'none' }}
              >
                {rating.tool.name}
              </Link>
            )}

            <Stack spacing={2}>
              <RatingStars rating={rating.rating} size="sm" />
              {rating.comment && (
                <Text color="gray.600">{rating.comment}</Text>
              )}
              {rating.createdAt && (
                <Text fontSize="sm" color="gray.500">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </Text>
              )}
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};
