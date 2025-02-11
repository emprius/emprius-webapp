import React from 'react'
import { Center, Spinner, Text, useColorModeValue, VStack } from '@chakra-ui/react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullScreen?: boolean
}

export const LoadingSpinner = ({ message, size = 'xl', fullScreen = false }: LoadingSpinnerProps) => {
  const spinnerColor = useColorModeValue('primary.500', 'primary.300')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const bgColor = useColorModeValue('white', 'gray.800')

  const content = (
    <VStack spacing={4}>
      <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color={spinnerColor} size={size} />
      {message && (
        <Text color={textColor} fontSize='lg'>
          {message}
        </Text>
      )}
    </VStack>
  )

  if (fullScreen) {
    return (
      <Center position='fixed' top={0} left={0} right={0} bottom={0} bg={bgColor} zIndex={9999} w={'full'}>
        {content}
      </Center>
    )
  }

  return (
    <Center py={8} minH='200px'>
      {content}
    </Center>
  )
}
