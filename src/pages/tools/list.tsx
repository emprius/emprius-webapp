import React from 'react'
import { useTools } from '~components/Tools/queries'
import { ToolList } from '~components/Tools/List'
import { MainContainer } from '~components/Layout/LayoutComponents'
import { RoutedPaginationProvider } from '~components/Layout/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'
import { HStack, useColorModeValue, VStack } from '@chakra-ui/react'
import { DebouncedSearchProvider } from '~components/Layout/Search/DebouncedSearchContext'
import { DebouncedSearchBar } from '~components/Layout/Search/DebouncedSearchBar'

export const List = () => (
  <RoutedPaginationProvider>
    <DebouncedSearchProvider>
      <PaginatedList />
    </DebouncedSearchProvider>
  </RoutedPaginationProvider>
)

const PaginatedList = () => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { data: toolsResponse, isLoading, error, isError } = useTools()

  return (
    <MainContainer>
      <HStack w={'full'} justifyContent={'center'} bg={bgColor} borderColor={borderColor} borderRadius='2xl' mb={4}>
        <DebouncedSearchBar />
      </HStack>
      <ToolList tools={toolsResponse?.tools || []} isLoading={isLoading} error={error} isError={isError} />
      <HStack w={'full'} justifyContent={'center'} mt={4}>
        <VStack bg={bgColor} w={'min-content'} p={4} borderWidth={1} borderColor={borderColor} borderRadius='lg'>
          <RoutedPagination pagination={toolsResponse?.pagination} />
        </VStack>
      </HStack>
    </MainContainer>
  )
}
