import { modalAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(modalAnatomy.keys)

const baseStyle = definePartsStyle((props: { colorMode: string }) => ({
  dialog: {
    bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
    borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
  },
  header: {
    borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
    color: props.colorMode === 'dark' ? 'white' : 'gray.800',
  },
  body: {
    color: props.colorMode === 'dark' ? 'white' : 'gray.800',
  },
  footer: {
    borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
  },
}))

export const Modal = defineMultiStyleConfig({
  baseStyle,
})
