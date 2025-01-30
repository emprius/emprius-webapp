import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    focusBorderColor: 'primary.500',
  },
})

const variants = {
  outline: definePartsStyle((props: { colorMode: string }) => ({
    field: {
      bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'white',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      _placeholder: {
        color: props.colorMode === 'dark' ? 'whiteAlpha.600' : 'gray.500',
      },
    },
  })),
}

export const Input = defineMultiStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: 'outline',
  },
})
