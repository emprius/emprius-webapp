import { modalAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(modalAnatomy.keys)

const baseStyle = definePartsStyle({
  dialog: {
    bg: 'white',
    borderColor: 'gray.200',
    _dark: {
      bg: 'gray.800',
      borderColor: 'whiteAlpha.300',
    },
  },
  header: {
    borderColor: 'gray.200',
    color: 'gray.800',
    _dark: {
      borderColor: 'whiteAlpha.300',
      color: 'white',
    },
  },
  body: {
    color: 'gray.800',
    _dark: {
      color: 'white',
    },
  },
  footer: {
    borderColor: 'gray.200',
    _dark: {
      borderColor: 'whiteAlpha.300',
    },
  },
})

export const Modal = defineMultiStyleConfig({
  baseStyle,
})
