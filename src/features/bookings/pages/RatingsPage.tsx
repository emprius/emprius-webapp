import { useGetPendingRatings } from '../bookingQueries';
import { useTranslation } from 'react-i18next';
import { RatingCard } from '../components/RatingCard';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';

export const RatingsPage = () => {
  const { t } = useTranslation();
  const { data: pendingRatings, isLoading, error } = useGetPendingRatings();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  if (isLoading) {
    return (
      <Center minH="calc(100vh - 64px)">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="calc(100vh - 64px)" p={4}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {t('rating.error')}
        </Alert>
      </Center>
    );
  }

  if (!pendingRatings?.length) {
    return (
      <Center minH="calc(100vh - 64px)" p={4}>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          {t('rating.noRatings')}
        </Alert>
      </Center>
    );
  }

  return (
    <Box bg={bgColor} minH="calc(100vh - 64px)" py={8}>
      <Container maxW="container.xl">
        <Heading mb={8} size="lg">
          {t('rating.pendingRatings')}
        </Heading>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={6}
          autoRows="auto"
        >
          {pendingRatings.map((rating) => (
            <RatingCard key={rating.id} rating={rating} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};
