import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { IconButton, Input, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react'
import React, { forwardRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AUTH_FORM } from '~utils/constants'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import { FieldPath, FieldValues } from 'react-hook-form'

export function usePasswordFieldValidator<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>(): RegisterOptions<TFieldValues, TFieldName> {
  const { t } = useTranslation()
  return {
    minLength: {
      value: AUTH_FORM.MIN_PASSWORD_LENGTH,
      message: t('auth.password_too_short'),
    },
  }
}

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size='md'>
      <Input ref={ref} type={show ? 'text' : 'password'} {...props} />
      <InputRightElement>
        <IconButton
          size='sm'
          onClick={handleClick}
          aria-label={show ? 'Hide password' : 'Show password'}
          icon={show ? <ViewOffIcon /> : <ViewIcon />}
          variant='ghost'
          color='gray.400'
        />
      </InputRightElement>
    </InputGroup>
  )
})
