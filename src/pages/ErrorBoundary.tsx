import { Box, Button, Container, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { ChunkErrorBoundary } from '~src/pages/ChunkErrorBoundary'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    console.log('isERrorBoundary', error)
    return {
      hasError: true,
      error,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} onReload={this.handleReload} />
    }

    return this.props.children
  }

  private handleReload = () => {
    window.location.reload()
  }
}

interface ErrorDisplayProps {
  error: Error | null
  onReload: () => void
}

const ErrorDisplay = ({ error, onReload }: ErrorDisplayProps) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const { t } = useTranslation()

  return (
    <Box minH='100vh' display='flex' alignItems='center' bg={bgColor}>
      <Container maxW='container.md'>
        <Stack spacing={8} bg={bgColor} p={8} borderRadius='lg' boxShadow='sm' textAlign='center'>
          <Stack spacing={4}>
            <Heading size='xl'>Oops! Something went wrong</Heading>
            <Text color='gray.600' fontSize='lg'>
              {t('error.error_boundary_msg', {
                defaultValue: "We're sorry, but there was an error processing your request.",
              })}
            </Text>
            {process.env.NODE_ENV === 'development' && error && (
              <Box
                bg='gray.50'
                p={4}
                borderRadius='md'
                textAlign='left'
                fontFamily='mono'
                fontSize='sm'
                color='red.500'
                whiteSpace='pre-wrap'
              >
                {error.toString()}
              </Box>
            )}
          </Stack>

          <Button onClick={onReload} size='lg' leftIcon={<FiRefreshCw />} alignSelf='center'>
            {t('common.reload_page', {
              defaultValue: 'Reload Page',
            })}
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export const ErrorBoundaries = ({ children }: Props) => {
  return (
    <ErrorBoundary>
      <ChunkErrorBoundary>{children}</ChunkErrorBoundary>
    </ErrorBoundary>
  )
}
