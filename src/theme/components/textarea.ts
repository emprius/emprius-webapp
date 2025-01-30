import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  focusBorderColor: 'primary.500',
})

const outline = defineStyle((props: { colorMode: string }) => ({
  bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'white',
  color: props.colorMode === 'dark' ? 'white' : 'gray.800',
  _placeholder: {
    color: props.colorMode === 'dark' ? 'whiteAlpha.600' : 'gray.500',
  },
}))

export const Textarea = defineStyleConfig({
  baseStyle,
  variants: { outline },
  defaultProps: {
    variant: 'outline',
  },
})
