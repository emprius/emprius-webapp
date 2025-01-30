import { popoverAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(popoverAnatomy.keys)

const baseStyle = definePartsStyle({
  content: {
    bg: 'white',
    borderColor: 'gray.200',
    color: 'gray.800',
    _dark: {
      bg: 'gray.700',
      borderColor: 'whiteAlpha.300',
      color: 'white',
    },
  },
  header: {
    borderColor: 'gray.200',
    _dark: {
      borderColor: 'whiteAlpha.300',
    },
  },
  body: {
    color: 'gray.800',
    _dark: {
      color: 'white',
    },
  },
})

export const Popover = defineMultiStyleConfig({
  baseStyle,
})
