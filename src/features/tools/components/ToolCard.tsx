import React from 'react';
import {
  Box,
  Image,
  Stack,
  Text,
  Badge,
  Link,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiStar } from 'react-icons/fi';
import type { Tool } from '../../../types';
import { formatCurrency } from '../../../utils';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-4px)' }}
    >
      <Box position="relative">
        <Image
          src={tool.images[0]}
          alt={tool.name}
          height="200px"
          width="100%"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme={tool.status === 'available' ? 'green' : 'gray'}
          px={2}
          py={1}
          borderRadius="full"
        >
          {t(`tools.status.${tool.status}`)}
        </Badge>
      </Box>

      <Stack p={4} spacing={3}>
        <Stack spacing={1}>
          <Link
            as={RouterLink}
            to={`/tools/${tool.id}`}
            fontWeight="semibold"
            fontSize="lg"
            _hover={{ color: 'primary.500', textDecoration: 'none' }}
          >
            {tool.name}
          </Link>
          <Text color="primary.500" fontSize="xl" fontWeight="bold">
            {formatCurrency(tool.price)}/day
          </Text>
        </Stack>

        <Text
          color="gray.600"
          noOfLines={2}
          title={tool.description}
        >
          {tool.description}
        </Text>

        <Stack direction="row" align="center" color="gray.600" fontSize="sm">
          <FiMapPin />
          <Text noOfLines={1}>{tool.location.address}</Text>
        </Stack>

        <Stack direction="row" align="center" spacing={4}>
          <Stack direction="row" align="center" spacing={2}>
            <Avatar
              size="sm"
              name={tool.owner.name}
              src={tool.owner.avatar}
            />
            <Link
              as={RouterLink}
              to={`/users/${tool.owner.id}`}
              fontWeight="medium"
              _hover={{ color: 'primary.500', textDecoration: 'none' }}
            >
              {tool.owner.name}
            </Link>
          </Stack>
          <Stack direction="row" align="center" color="orange.400">
            <FiStar />
            <Text>{tool.owner.rating.toFixed(1)}</Text>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
