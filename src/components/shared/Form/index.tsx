import React from 'react';
import {
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  FormErrorMessage as ChakraFormErrorMessage,
  Input as ChakraInput,
  type FormControlProps,
  type FormLabelProps,
  type FormErrorMessageProps,
  type InputProps,
} from '@chakra-ui/react';

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  (props, ref) => (
    <ChakraFormControl
      ref={ref}
      {...props}
      sx={{
        '& + &': {
          mt: 4,
        },
      }}
    />
  )
);

FormControl.displayName = 'FormControl';

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  (props, ref) => (
    <ChakraFormLabel
      ref={ref}
      mb={2}
      fontWeight="medium"
      {...props}
    />
  )
);

FormLabel.displayName = 'FormLabel';

export const FormErrorMessage = React.forwardRef<HTMLDivElement, FormErrorMessageProps>(
  (props, ref) => (
    <ChakraFormErrorMessage
      ref={ref}
      mt={1}
      {...props}
    />
  )
);

FormErrorMessage.displayName = 'FormErrorMessage';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => (
    <ChakraInput
      ref={ref}
      {...props}
    />
  )
);

Input.displayName = 'Input';
