import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(checkboxAnatomy.keys)

export const Checkbox = defineMultiStyleConfig({
  defaultProps: {
    colorScheme: 'primary',
  },
})
