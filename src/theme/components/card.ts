import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { theme } from '@chakra-ui/theme'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys)

// Define the error variant
const error = definePartsStyle({
  container: {
    borderColor: 'red.300',
    borderWidth: '2px',
    shadow: 'md',
    boxShadow: '0px 4px 6px rgba(255, 0, 0, 0.2)', // Red shadow
    _hover: {
      shadow: 'md',
      boxShadow: '0px 6px 8px rgba(255, 0, 0, 0.3)', // Darker red on hover
      borderColor: 'red.400',
    },
    transition: 'all 0.2s',
  },
})

// Define the new variant
const newItem = definePartsStyle({
  container: {
    borderColor: 'primary.300',
    borderWidth: '2px',
    shadow: 'md',
    boxShadow: '0px 4px 6px rgba(0, 200, 100, 0.2)', // Greenish shadow
    _hover: {
      shadow: 'md',
      boxShadow: '0px 6px 8px rgba(0, 200, 100, 0.3)', // Stronger green on hover
      borderColor: 'primary.400',
    },
    transition: 'all 0.2s',
  },
})

// Define the default variant
const elevatedXl = definePartsStyle({
  container: {
    variant: 'outline',
    shadow: 'md',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Default subtle shadow
    _hover: {
      shadow: 'md',
      boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.2)', // Slightly stronger default shadow
    },
    transition: 'box-shadow 0.2s',
  },
})

export const Card = defineMultiStyleConfig({
  baseStyle: theme.components.Card.baseStyle,
  variants: {
    error,
    newItem,
    elevatedXl,
    ...theme.components.Card.variants,
  },
  defaultProps: {
    variant: 'elevated', // Set a default variant if needed
  },
})
