import { Box, Flex, Heading, useColorModeValue } from '@chakra-ui/react'
import React, { ReactNode, useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { MainContainer } from '~components/Layout/LayoutComponents'

export type TitlePageLayoutContext = {
  setData: (title?: string, rightContent?: ReactNode) => void
}

export const TitlePageLayout = () => {
  const [title, setTitle] = useState<string | null>(null)
  const [rightContent, setRightContent] = useState<ReactNode | null>(null)
  const bgColor = useColorModeValue('white', 'gray.800')

  const setData = useCallback((title: string = null, rightContent: ReactNode = null): void => {
    setTitle(title)
    setRightContent(rightContent)
  }, [])

  return (
    <MainContainer>
      <Box bg={bgColor} borderRadius='lg' p={{ base: 3, md: 6 }} boxShadow='sm'>
        <Flex justify='space-between' align='center'>
          {title && (
            <Heading size='md' mb={4}>
              {title}
            </Heading>
          )}
          {rightContent}
        </Flex>
        <Outlet context={{ setData } satisfies TitlePageLayoutContext} />
      </Box>
    </MainContainer>
  )
}
