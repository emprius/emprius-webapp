import React from 'react';
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  forwardRef,
  useColorModeValue,
} from '@chakra-ui/react';

export interface ButtonProps extends ChakraButtonProps {
  isFullWidth?: boolean;
}

export const Button = forwardRef<ButtonProps, 'button'>((props, ref) => {
  const {
    children,
    variant = 'solid',
    size = 'md',
    isFullWidth,
    ...rest
  } = props;

  const solidBg = useColorModeValue('primary.500', 'primary.300');
  const solidHoverBg = useColorModeValue('primary.600', 'primary.400');
  const outlineBorderColor = useColorModeValue('primary.500', 'primary.300');
  const outlineColor = useColorModeValue('primary.500', 'primary.300');
  const outlineHoverBg = useColorModeValue('primary.50', 'primary.900');
  const ghostColor = useColorModeValue('primary.500', 'primary.300');
  const ghostHoverBg = useColorModeValue('primary.50', 'primary.900');

  const variantProps = {
    solid: {
      bg: solidBg,
      color: 'white',
      _hover: {
        bg: solidHoverBg,
        _disabled: {
          bg: solidBg,
        },
      },
    },
    outline: {
      borderColor: outlineBorderColor,
      color: outlineColor,
      _hover: {
        bg: outlineHoverBg,
      },
    },
    ghost: {
      color: ghostColor,
      _hover: {
        bg: ghostHoverBg,
      },
    },
  };

  return (
    <ChakraButton
      ref={ref}
      variant={variant}
      size={size}
      width={isFullWidth ? '100%' : 'auto'}
      {...variantProps[variant as keyof typeof variantProps]}
      {...rest}
    >
      {children}
    </ChakraButton>
  );
});

Button.displayName = 'Button';
