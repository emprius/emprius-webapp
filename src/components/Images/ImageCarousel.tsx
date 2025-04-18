import { Box, Center, Flex, HStack, IconButton } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { ServerImage } from '~components/Images/ServerImage'

interface ImageCarouselProps {
  imageIds: string[]
  height?: string | number
  width?: string | number
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ imageIds, height = '400px', width = '100%' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageIds.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageIds.length - 1 ? 0 : prev + 1))
  }

  if (!imageIds.length) return null

  return (
    <>
      <Box position='relative' height={height} width={width}>
        <Flex height='100%' alignItems='center'>
          {imageIds.length > 1 && (
            <IconButton
              aria-label='Previous image'
              icon={<FiChevronLeft />}
              onClick={handlePrevious}
              position='absolute'
              left={2}
              zIndex={2}
              variant='ghost'
              colorScheme='blackAlpha'
              bg='whiteAlpha.700'
              _hover={{ bg: 'whiteAlpha.900' }}
            />
          )}

          <Center width='100%' height='100%' overflow='hidden'>
            <Box cursor='pointer' height='100%' width='100%'>
              <ServerImage
                imageId={imageIds[currentIndex]}
                objectFit='cover'
                height='100%'
                width='100%'
                thumbnail
                modal
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasMultipleImages={imageIds.length > 1}
              />
            </Box>
          </Center>

          {imageIds.length > 1 && (
            <IconButton
              aria-label='Next image'
              icon={<FiChevronRight />}
              onClick={handleNext}
              position='absolute'
              right={2}
              zIndex={2}
              variant='ghost'
              colorScheme='blackAlpha'
              bg='whiteAlpha.700'
              _hover={{ bg: 'whiteAlpha.900' }}
            />
          )}
        </Flex>

        {imageIds.length > 1 && (
          <HStack
            spacing={2}
            justify='center'
            position='absolute'
            bottom={4}
            left={0}
            right={0}
            zIndex={2}
            py={2}
            bg='blackAlpha.300'
            backdropFilter='blur(2px)'
          >
            {imageIds.map((_, index) => (
              <Box
                key={index}
                w={index === currentIndex ? '10px' : '6px'}
                h={index === currentIndex ? '10px' : '6px'}
                borderRadius='full'
                bg={index === currentIndex ? 'white' : 'whiteAlpha.700'}
                cursor='pointer'
                onClick={() => setCurrentIndex(index)}
                transition='all 0.2s'
                _hover={{ bg: 'white' }}
              />
            ))}
          </HStack>
        )}
      </Box>
    </>
  )
}
