import React, { Component, ReactNode } from 'react'
import { Box, Button, Text, VStack } from '@chakra-ui/react'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { useTranslation } from 'react-i18next'
import { icons } from '~theme/icons'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const isChunkError = isChunkLoadError(error)
    console.log('isChunkError', isChunkError)

    return {
      hasError: isChunkError,
      error,
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} onReload={this.forceReload} />
    }

    return this.props.children
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
}

const ErrorDisplay = ({ error, onReload }: { error: Error | null; onReload: () => void }) => {
  const { t } = useTranslation()
  return (
    <Box minH='100vh' display='flex'>
      <VStack spacing={2} align={'center'} justify={'start'} w={'full'}>
        <ElementNotFound
          title={t('chunk_error_title', {
            defaultValue: 'An update is available',
          })}
          desc={t('chunk_error_desc', {
            defaultValue: 'The page cannot be loaded due to an update. Please reload the page.',
          })}
          icon={icons.updateAvailable}
        />

        <Button size={'lg'} onClick={onReload}>
          {t('common.update', { defaultValue: 'Update' })}
        </Button>

        {process.env.NODE_ENV === 'development' && error && (
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
              {error.stack || error.message}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

// Helper function to check if error is a chunk loading error
export function isChunkLoadError(error: any): boolean {
  if (!error) return false

  const errorMessage = error.message || error.toString()
  const chunkErrorPatterns = [
    /loading dynamically imported module/i,
    /loading css chunk/i,
    /loading chunk/i,
    /failed to fetch dynamically imported module/i,
    /networkError/i,
    /ChunkLoadError/i,
  ]
  return chunkErrorPatterns.some((pattern) => pattern.test(errorMessage))
}
