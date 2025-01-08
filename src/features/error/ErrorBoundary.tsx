import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          error={this.state.error}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error: Error | null;
  onReload: () => void;
}

const ErrorDisplay = ({ error, onReload }: ErrorDisplayProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Container maxW="container.md">
        <Stack
          spacing={8}
          bg={bgColor}
          p={8}
          borderRadius="lg"
          boxShadow="sm"
          textAlign="center"
        >
          <Stack spacing={4}>
            <Heading size="xl">Oops! Something went wrong</Heading>
            <Text color="gray.600" fontSize="lg">
              We're sorry, but there was an error processing your request.
            </Text>
            {process.env.NODE_ENV === 'development' && error && (
              <Box
                bg="gray.50"
                p={4}
                borderRadius="md"
                textAlign="left"
                fontFamily="mono"
                fontSize="sm"
                color="red.500"
                whiteSpace="pre-wrap"
              >
                {error.toString()}
              </Box>
            )}
          </Stack>

          <Button
            onClick={onReload}
            size="lg"
            leftIcon={<FiRefreshCw />}
            alignSelf="center"
          >
            Reload Page
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};
