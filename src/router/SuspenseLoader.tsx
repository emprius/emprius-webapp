import { Spinner, Square, SquareProps, Text, VStack } from '@chakra-ui/react'
import { ReactNode, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { ChunkErrorBoundary } from './ChunkErrorBoundary'

export const Loading = ({ ...rest }: SquareProps) => {
  const { t } = useTranslation()

  return (
    <Square centerContent size='full' minHeight='100vh' {...rest}>
      <VStack spacing={3}>
        <Spinner size='lg' color='blue.500' />
        <Text fontSize='sm' color='gray.600'>
          {t('loading')}
        </Text>
      </VStack>
    </Square>
  )
}

export const SuspenseLoader = ({ children }: { children: ReactNode }) => (
  <ChunkErrorBoundary>
    <Suspense fallback={<Loading />}>{children}</Suspense>
  </ChunkErrorBoundary>
)
