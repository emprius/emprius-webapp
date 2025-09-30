import { Box, HStack, StackProps } from '@chakra-ui/react'
import { ServerImage } from '~components/Images/ServerImage'

export const ImagesGrid = ({
  images,
  imageSize = '50px',
  ...props
}: {
  images: string[]
  imageSize?: string
} & StackProps) => {
  if (!images) return
  return (
    <HStack wrap={'nowrap'} spacing={4} overflow={'hidden'} {...props}>
      {images.map((image, index) => (
        <Box key={`${image}${index}`} position='relative' w={imageSize} h={imageSize} flex='0 0 auto'>
          <ServerImage imageId={image} objectFit='cover' w='100%' h='100%' borderRadius='md' thumbnail modal />
        </Box>
      ))}
    </HStack>
  )
}
