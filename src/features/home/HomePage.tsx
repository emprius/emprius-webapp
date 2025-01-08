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
        bg={bgColor}
        py={{ base: 16, md: 24 }}
        borderBottomWidth={1}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Container maxW="container.xl">
          <Stack spacing={8} alignItems="center" textAlign="center">
            <Stack spacing={4} maxW="3xl">
              <Heading
                as="h1"
                size="2xl"
                fontWeight="bold"
                lineHeight="shorter"
              >
                {t('home.title')}
              </Heading>
              <Text fontSize="xl" color={textColor}>
                {t('home.subtitle')}
              </Text>
            </Stack>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Button
                size="lg"
                onClick={() => navigate('/tools')}
              >
                {t('home.findTools')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/tools/new')}
              >
                {t('tools.addTool')}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 16, md: 24 }}>
        <Container maxW="container.xl">
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 10, md: 8 }}
          >
            {features.map((feature) => (
              <Stack
                key={feature.title}
                spacing={4}
                bg={bgColor}
                p={8}
                borderRadius="lg"
                boxShadow="sm"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
                transition="all 0.2s"
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
        </Container>
      </Box>
    </Box>
  );
};
