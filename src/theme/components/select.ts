import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(selectAnatomy.keys)

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
      _dark: {
        bg: 'whiteAlpha.100',
        color: 'white',
      },
    },
  }),
}

export const Select = defineMultiStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: 'outline',
  },
})
