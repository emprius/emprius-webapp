import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { IconButton, Input, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react'
import { forwardRef, useState } from 'react'

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size='md'>
      <Input ref={ref} pr='4.5rem' type={show ? 'text' : 'password'} {...props} />
      <InputRightElement width='4.5rem'>
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
