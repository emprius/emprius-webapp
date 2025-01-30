import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys)

const baseStyle = definePartsStyle((props: { colorMode: string }) => ({
  list: {
    bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
    borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
  },
  item: {
    bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
    color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    _hover: {
      bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
    },
    _focus: {
      bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
    },
  },
}))

export const Menu = defineMultiStyleConfig({
  baseStyle,
})
