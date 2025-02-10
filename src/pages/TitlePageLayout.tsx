import { Box, Heading, useColorModeValue } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { MainContainer } from '~components/Layout/LayoutComponents'

export type TitlePageLayoutContext = {
  setTitle: (title: string) => void
}

export const TitlePageLayout = () => {
  const [title, setTitle] = useState<string | null>(null)
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <MainContainer>
      <Box bg={bgColor} borderRadius='lg' p={{ base: 3, md: 6 }} boxShadow='sm'>
        {title && (
          <Heading size='md' mb={4}>
            {title}
          </Heading>
        )}
        <Outlet context={{ setTitle } satisfies TitlePageLayoutContext} />
      </Box>
    </MainContainer>
  )
}
