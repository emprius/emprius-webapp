import React from 'react'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { useTools } from '~components/Tools/queries'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ToolList } from '~components/Tools/List'
import { MainContainer } from '~components/Layout/LayoutComponents'
import { RoutedPaginationProvider, useRoutedPagination } from '~components/Layout/Pagination/PaginationProvider'
import { ROUTES } from '~src/router/routes'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'
import { Box, HStack, useColorModeValue, VStack } from '@chakra-ui/react'
export const List = () => (
  <RoutedPaginationProvider>
    <PaginatedList />
  </RoutedPaginationProvider>
)

const PaginatedList = () => {
  const { page } = useRoutedPagination()
  const { data: toolsResponse, isLoading, error, isError } = useTools({ page })
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ErrorComponent error={error} />
  }

  return (
    <MainContainer>
      <ToolList tools={toolsResponse?.tools || []} />
      <HStack w={'full'} justifyContent={'center'} mt={4}>
        <VStack bg={bgColor} w={'min-content'} p={4} borderWidth={1} borderColor={borderColor} borderRadius='lg'>
          <RoutedPagination pagination={toolsResponse.pagination} />
        </VStack>
      </HStack>
    </MainContainer>
  )
}
