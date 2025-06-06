import React from 'react'
import { useParams } from 'react-router-dom'
import { useUserTools } from '~components/Tools/queries'
import { ToolList } from '~components/Tools/List'
import { HStack, VStack } from '@chakra-ui/react'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'
import { SearchAndPagination } from '~components/Layout/Search/SearchAndPagination'
import { DebouncedSearchBar } from '~components/Layout/Search/DebouncedSearchBar'
import { useTranslation } from 'react-i18next'

export const UserTools = () => (
  <SearchAndPagination>
    <PaginatedUserTools />
  </SearchAndPagination>
)

const PaginatedUserTools = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const {
    data: toolsData,
    isError: isToolsError,
    error: toolsError,
    isLoading: isToolsLoading,
  } = useUserTools(id || '')

  return (
    <>
      <HStack w={'full'} justifyContent={'center'} borderRadius='2xl' mb={4}>
        <DebouncedSearchBar
          placeholder={t('tools.filter_tools', { defaultValue: 'Filter by tool name or description' })}
        />
      </HStack>
      <ToolList tools={toolsData?.tools || []} isLoading={isToolsLoading} isError={isToolsError} error={toolsError} />
      <HStack w={'full'} justifyContent={'center'} mt={4}>
        <VStack w={'min-content'}>
          <RoutedPagination pagination={toolsData?.pagination} />
        </VStack>
      </HStack>
    </>
  )
}
