import { numberInputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(numberInputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    focusBorderColor: 'primary.500',
    borderRadius: '2xl',
    transition: 'all 0.2s ease-in-out',
    _focus: {
      boxShadow: '0 0 0 2px rgba(56, 161, 105, 0.3)', // primary.500 with opacity
      borderColor: 'primary.500',
    },
    _dark: {
      color: 'whiteAlpha.900',
      bg: 'gray.700',
    },
  },
  stepper: {
    borderColor: 'gray.200',
    _dark: {
      borderColor: 'whiteAlpha.300',
    },
  },
  stepperGroup: {
    _dark: {
      bg: 'gray.700',
    },
  },
  incrementStepper: {
    _hover: {
      bg: 'gray.100',
      _dark: {
        bg: 'whiteAlpha.200',
      },
    },
  },
  decrementStepper: {
    _hover: {
      bg: 'gray.100',
      _dark: {
        bg: 'whiteAlpha.200',
      },
    },
  },
})

export const NumberInput = defineMultiStyleConfig({
  baseStyle,
  defaultProps: {
    variant: 'outline',
  },
})
