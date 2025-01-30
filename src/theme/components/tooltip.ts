import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle((props: { colorMode: string }) => ({
  bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.700',
  color: props.colorMode === 'dark' ? 'white' : 'white',
  borderRadius: 'md',
  px: '2',
  py: '1',
}))

export const Tooltip = defineStyleConfig({
  baseStyle,
})
