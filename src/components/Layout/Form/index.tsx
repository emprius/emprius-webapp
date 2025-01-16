import {
  FormControl as ChakraFormControl,
  type FormControlProps,
  FormErrorMessage as ChakraFormErrorMessage,
  type FormErrorMessageProps,
  FormLabel as ChakraFormLabel,
  type FormLabelProps,
  Input as ChakraInput,
  type InputProps,
} from '@chakra-ui/react'
import { forwardRef } from 'react'

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>((props, ref) => (
  <ChakraFormControl
    ref={ref}
    {...props}
    sx={{
      '& + &': {
        mt: 4,
      },
    }}
  />
))

FormControl.displayName = 'FormControl'

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>((props, ref) => (
  <ChakraFormLabel ref={ref} mb={2} fontWeight='medium' {...props} />
))

FormLabel.displayName = 'FormLabel'

export const FormErrorMessage = forwardRef<HTMLDivElement, FormErrorMessageProps>((props, ref) => (
  <ChakraFormErrorMessage ref={ref} mt={1} {...props} />
))

FormErrorMessage.displayName = 'FormErrorMessage'

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => <ChakraInput ref={ref} {...props} />)

Input.displayName = 'Input'
