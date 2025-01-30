import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    focusBorderColor: 'primary.500',
  },
})

const variants = {
  outline: definePartsStyle({
    field: {
      bg: 'white',
      color: 'gray.800',
      _placeholder: {
        color: 'gray.500',
      },
      _dark: {
        bg: 'whiteAlpha.100',
        color: 'white',
      },
    },
  }),
}

export const Input = defineMultiStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: 'outline',
  },
})
