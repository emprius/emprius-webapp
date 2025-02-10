import { Heading, Stack, useColorModeValue } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { MainContainer } from '~components/Layout/LayoutComponents'

export type FormLayoutContext = {
  setTitle: (title: string) => void
}

export const FormLayout = () => {
  const [title, setTitle] = useState<string | null>(null)
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <MainContainer>
      <Stack bg={bgColor} px={{ base: 4, md: 8 }} py={8} borderRadius='lg' boxShadow='sm' spacing={4}>
        {title && (
          <Heading size='lg' mb={4}>
            {title}
          </Heading>
        )}
        <Outlet context={{ setTitle } satisfies FormLayoutContext} />
      </Stack>
    </MainContainer>
  )
}
