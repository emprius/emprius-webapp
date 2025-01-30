import { Container, Heading, Stack, useColorModeValue } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

export type FormLayoutContext = {
  setTitle: (title: string) => void
}

export const FormLayout = () => {
  const [title, setTitle] = useState<string | null>(null)
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Container maxW='container.md' py={8}>
      <Stack bg={bgColor} p={8} borderRadius='lg' boxShadow='sm' spacing={4}>
        {title && (
          <Heading size='lg' mb={4}>
            {title}
          </Heading>
        )}
        <Outlet context={{ setTitle } satisfies FormLayoutContext} />
      </Stack>
    </Container>
  )
}
