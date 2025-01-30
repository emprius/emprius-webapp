import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys)

const baseStyle = definePartsStyle({
  list: {
    bg: 'white',
    borderColor: 'gray.200',
    _dark: {
      bg: 'gray.700',
      borderColor: 'whiteAlpha.300',
    },
  },
  item: {
    bg: 'white',
    color: 'gray.800',
    _hover: {
      bg: 'gray.100',
    },
    _focus: {
      bg: 'gray.100',
    },
    _dark: {
      bg: 'gray.700',
      color: 'white',
      _hover: {
        bg: 'whiteAlpha.200',
      },
      _focus: {
        bg: 'whiteAlpha.200',
      },
    },
  },
})

export const Menu = defineMultiStyleConfig({
  baseStyle,
})
