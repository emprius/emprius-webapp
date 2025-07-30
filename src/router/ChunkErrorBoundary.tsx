import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Box, Button, Text, VStack, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { isChunkLoadError } from '~utils/chunkErrorHandler'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  isChunkError: boolean
  retryCount: number
}

export class ChunkErrorBoundary extends Component<Props, State> {
  private maxRetries = 3
  private retryTimeout: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      isChunkError: false,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const isChunkError = isChunkLoadError(error)

    return {
      hasError: true,
      error,
      isChunkError,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChunkErrorBoundary caught an error:', error, errorInfo)

    if (this.state.isChunkError) {
      // Auto-retry chunk errors
      this.handleChunkError()
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }

  render() {
    if (this.state.hasError) {
      // If it's a chunk error and we haven't exceeded retries, show loading state
      if (this.state.isChunkError && this.state.retryCount < this.maxRetries) {
        return (
          <Box display='flex' alignItems='center' justifyContent='center' minHeight='50vh' p={4}>
            <VStack spacing={4}>
              <Text>Loading...</Text>
              <Text fontSize='sm' color='gray.500'>
                Retrying ({this.state.retryCount + 1}/{this.maxRetries})
              </Text>
            </VStack>
          </Box>
        )
      }

      // Custom fallback or default error UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Box display='flex' alignItems='center' justifyContent='center' minHeight='50vh' p={4}>
          <VStack spacing={6} maxWidth='md' textAlign='center'>
            <Alert status='error' borderRadius='md'>
              <AlertIcon />
              <Box>
                <AlertTitle>{this.state.isChunkError ? 'Loading Error' : 'Something went wrong'}</AlertTitle>
                <AlertDescription>
                  {this.state.isChunkError
                    ? 'There was an issue loading the page. This usually happens after an app update.'
                    : 'An unexpected error occurred. Please try again.'}
                </AlertDescription>
              </Box>
            </Alert>

            <VStack spacing={3}>
              <Button colorScheme='blue' onClick={this.handleRetry} size='lg'>
                Try Again
              </Button>

              <Button variant='outline' onClick={this.forceReload} size='sm'>
                Reload Page
              </Button>
            </VStack>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                as='details'
                mt={4}
                p={4}
                bg='gray.50'
                borderRadius='md'
                fontSize='sm'
                textAlign='left'
                maxWidth='100%'
                overflow='auto'
              >
                <Text as='summary' cursor='pointer' fontWeight='bold' mb={2}>
                  Error Details (Development)
                </Text>
                <Text as='pre' whiteSpace='pre-wrap' fontSize='xs'>
                  {this.state.error.stack || this.state.error.message}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      )
    }

    return this.props.children
  }

  private handleChunkError = () => {
    if (this.state.retryCount < this.maxRetries) {
      console.log(`Retrying chunk load (attempt ${this.state.retryCount + 1}/${this.maxRetries})`)

      this.retryTimeout = setTimeout(
        () => {
          this.setState((prevState) => ({
            hasError: false,
            error: null,
            isChunkError: false,
            retryCount: prevState.retryCount + 1,
          }))
        },
        1000 * (this.state.retryCount + 1)
      ) // Exponential backoff
    } else {
      // Max retries reached, force reload
      // this.forceReload()
    }
  }

  private forceReload = () => {
    // Clear caches and reload
    if ('caches' in window) {
      caches
        .keys()
        .then((names) => {
          names.forEach((name) => caches.delete(name))
        })
        .finally(() => {
          ;(window as any).location.reload()
        })
    } else {
      ;(window as any).location.reload()
    }
  }

  private handleRetry = () => {
    if (this.state.isChunkError) {
      this.handleChunkError()
    } else {
      // For non-chunk errors, just reset the boundary
      this.setState({
        hasError: false,
        error: null,
        isChunkError: false,
        retryCount: 0,
      })
    }
  }

  // private handleReload = () => {
  //   this.forceReload()
  // }
}
