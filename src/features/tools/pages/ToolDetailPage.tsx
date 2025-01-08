import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Stack,
  Heading,
  Text,
  Badge,
  Avatar,
  Link,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiStar } from 'react-icons/fi';
import { useTool, useToolRatings } from '../../../hooks/queries';
import { BookingForm } from '../components/BookingForm';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { RatingList } from '../../../features/rating/components/RatingList';
import { useAuth } from '../../../features/auth/context/AuthContext';

export const ToolDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { data: tool, isLoading: isToolLoading } = useTool(id!);
  const { data: ratings, isLoading: isRatingsLoading } = useToolRatings(id!);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isToolLoading) {
    return <LoadingSpinner />;
  }

  if (!tool) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        <GridItem>
          <Stack spacing={8}>
            <Box
              bg={bgColor}
              borderWidth={1}
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
            >
              <Image
                src={tool.images[0]}
                alt={tool.name}
                height="400px"
                width="100%"
                objectFit="cover"
              />

              <Stack p={6} spacing={6}>
                <Stack spacing={4}>
                  <Stack
                    direction="row"
                    align="center"
                    justify="space-between"
                  >
                    <Heading size="lg">{tool.name}</Heading>
                    <Badge
                      colorScheme={tool.status === 'available' ? 'green' : 'gray'}
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      {t(`tools.status.${tool.status}`)}
                    </Badge>
                  </Stack>

                  <Text color="primary.500" fontSize="2xl" fontWeight="bold">
                    {tool.price}€/day
                  </Text>

                  <Text color="gray.600">{tool.description}</Text>
                </Stack>

                <Stack spacing={4}>
                  <Stack direction="row" align="center" color="gray.600">
                    <FiMapPin />
                    <Text>{tool.location.address}</Text>
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
              </Stack>
            </Box>

            <Box
              bg={bgColor}
              borderWidth={1}
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
            >
              <Stack p={6} spacing={4}>
                <Heading size="md">{t('tools.images')}</Heading>
                <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
                  {tool.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`${tool.name} - ${index + 1}`}
                      height="200px"
                      width="100%"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  ))}
                </Grid>
              </Stack>
            </Box>

            <Box
              bg={bgColor}
              borderWidth={1}
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
            >
              <Stack p={6} spacing={4}>
                <Heading size="md">{t('rating.reviews')}</Heading>
                {isRatingsLoading ? (
                  <LoadingSpinner />
                ) : (
                  <RatingList ratings={ratings || []} />
                )}
              </Stack>
            </Box>
          </Stack>
        </GridItem>

        <GridItem>
          <Stack spacing={4} position="sticky" top="20px">
            {isAuthenticated ? (
              tool.status === 'available' ? (
                <BookingForm tool={tool} />
              ) : (
                <Box
                  bg={bgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  textAlign="center"
                >
                  <Text color="gray.600" mb={4}>
                    {t('tools.notAvailable')}
                  </Text>
                  <Link
                    as={RouterLink}
                    to="/tools"
                    color="primary.500"
                    fontWeight="medium"
                  >
                    {t('tools.findOther')}
                  </Link>
                </Box>
              )
            ) : (
              <Box
                bg={bgColor}
                p={6}
                borderRadius="lg"
                boxShadow="sm"
                textAlign="center"
              >
                <Text color="gray.600" mb={4}>
                  {t('tools.loginToBook')}
                </Text>
                <Link
                  as={RouterLink}
                  to="/login"
                  color="primary.500"
                  fontWeight="medium"
                >
                  {t('nav.login')}
                </Link>
              </Box>
            )}
          </Stack>
        </GridItem>
      </Grid>
    </Container>
  );
};
