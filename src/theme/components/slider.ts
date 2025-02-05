import { sliderAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(sliderAnatomy.keys)

export const Slider = defineMultiStyleConfig({
  defaultProps: {
    colorScheme: 'primary',
  },
})
