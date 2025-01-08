import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from '../shared/ScrollToTop';
import { ErrorBoundary } from '../../features/error/ErrorBoundary';

export const Layout = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg={bgColor}
    >
      <ScrollToTop />
      <Navbar />
      <Box flex={1}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
      <Footer />
    </Box>
  );
};
