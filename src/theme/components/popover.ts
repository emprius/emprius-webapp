import { popoverAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(popoverAnatomy.keys)

const baseStyle = definePartsStyle((props: { colorMode: string }) => ({
  content: {
    bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
    borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
    color: props.colorMode === 'dark' ? 'white' : 'gray.800',
  },
  header: {
    borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
  },
  body: {
    color: props.colorMode === 'dark' ? 'white' : 'gray.800',
  },
}))

export const Popover = defineMultiStyleConfig({
  baseStyle,
})
