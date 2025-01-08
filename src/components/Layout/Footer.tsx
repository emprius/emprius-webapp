import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiGithub } from 'react-icons/fi';

export const Footer = () => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      as="footer"
      bg={bgColor}
      borderTop={1}
      borderStyle="solid"
      borderColor={borderColor}
      py={8}
      mt="auto"
    >
      <Container maxW="container.xl">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          spacing={4}
        >
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={{ base: 2, sm: 6 }}
            align="center"
          >
            <Link
              as={RouterLink}
              to="/"
              color={textColor}
              _hover={{ color: 'primary.500' }}
            >
              {t('nav.home')}
            </Link>
            <Link
              as={RouterLink}
              to="/tools"
              color={textColor}
              _hover={{ color: 'primary.500' }}
            >
              {t('nav.findTools')}
            </Link>
            <Link
              as={RouterLink}
              to="/about"
              color={textColor}
              _hover={{ color: 'primary.500' }}
            >
              {t('nav.about')}
            </Link>
          </Stack>

          <Stack
            direction="row"
            spacing={6}
            align="center"
            color={textColor}
            fontSize="sm"
          >
            <Text>© {new Date().getFullYear()} Emprius</Text>
            <Link
              href="https://github.com/emprius"
              target="_blank"
              rel="noopener noreferrer"
              display="inline-flex"
              alignItems="center"
              _hover={{ color: 'primary.500' }}
            >
              <FiGithub size={20} />
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
