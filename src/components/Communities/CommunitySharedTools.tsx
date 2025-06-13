import React from 'react'
import { useCommunityTools } from '~components/Communities/queries'
import { useParams } from 'react-router-dom'
import { ToolList } from '~components/Tools/List'
import { SearchAndPagination } from '~components/Layout/Search/SearchAndPagination'
import { HStack, useColorModeValue, VStack } from '@chakra-ui/react'
import { DebouncedSearchBar } from '~components/Layout/Search/DebouncedSearchBar'
import { useTranslation } from 'react-i18next'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'

export const CommunitySharedTools: React.FC = () => (
  <SearchAndPagination>
    <CommunitySharedToolsPaginated />
  </SearchAndPagination>
)

export const CommunitySharedToolsPaginated: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useCommunityTools(id!)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <VStack>
      <HStack bg={bgColor} borderColor={borderColor} borderRadius='2xl' flex={1} w='full'>
        <DebouncedSearchBar
          placeholder={t('tools.filter_tools', { defaultValue: 'Filter by tool name or description' })}
        />
      </HStack>
      <ToolList isLoading={isLoading} isError={isError} error={error} tools={data?.tools} />
      <RoutedPagination pagination={data?.pagination} />
    </VStack>
  )
}
