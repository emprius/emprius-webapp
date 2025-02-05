import { switchAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(switchAnatomy.keys)

export const Switch = defineMultiStyleConfig({
  defaultProps: {
    colorScheme: 'primary',
  },
})
