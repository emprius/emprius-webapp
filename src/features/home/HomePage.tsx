import React from 'react';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiTool, FiSearch, FiUsers } from 'react-icons/fi';

export const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const features = [
    {
      title: t('home.shareTools.title'),
      description: t('home.shareTools.description'),
      icon: FiTool,
    },
    {
      title: t('home.findWhat.title'),
      description: t('home.findWhat.description'),
      icon: FiSearch,
    },
    {
      title: t('home.buildCommunity.title'),
      description: t('home.buildCommunity.description'),
      icon: FiUsers,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        bgGradient="linear(to-r, primary.50, primary.100)"
        py={{ base: 20, md: 28 }}
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={{ base: 10, lg: 20 }}
            align="center"
            justify="space-between"
          >
            <Stack spacing={6} maxW="lg">
              <Heading
                as="h1"
                size="2xl"
                fontWeight="bold"
                lineHeight="shorter"
                color="primary.700"
              >
                {t('home.title')}
              </Heading>
              <Text fontSize="xl" color={textColor}>
                {t('home.subtitle')}
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button
                  size="lg"
                  colorScheme="primary"
                  onClick={() => navigate('/search')}
                >
                  {t('home.findTools')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="primary"
                  onClick={() => navigate('/tools/new')}
                >
                  {t('tools.addTool')}
                </Button>
              </Stack>
            </Stack>
            <Box
              maxW={{ base: "300px", lg: "400px" }}
              w="full"
              h="auto"
              position="relative"
            >
              <Box
                as="img"
                src="/assets/extra/emprius_logo.png"
                alt="Emprius"
                w="full"
                h="auto"
                objectFit="contain"
                filter="drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))"
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 20, md: 28 }} bg={bgColor}>
        <Container maxW="container.xl">
          <Stack spacing={12}>
            <Heading
              textAlign="center"
              size="xl"
              color="primary.600"
              mb={4}
            >
              {t('home.features')}
            </Heading>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 12, md: 10 }}
            >
            {features.map((feature) => (
                <Stack
                  key={feature.title}
                  spacing={6}
                  bg={useColorModeValue('white', 'gray.700')}
                  p={8}
                  borderRadius="xl"
                  boxShadow="lg"
                  _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                  transition="all 0.3s"
                  border="1px"
                  borderColor={useColorModeValue('gray.100', 'gray.600')}
                >
                <Icon
                  as={feature.icon}
                  w={8}
                  h={8}
                  color="primary.500"
                />
                <Stack spacing={2}>
                  <Text
                    fontSize="xl"
                    fontWeight="semibold"
                  >
                    {feature.title}
                  </Text>
                  <Text color={textColor}>
                    {feature.description}
                  </Text>
                </Stack>
              </Stack>
            ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
