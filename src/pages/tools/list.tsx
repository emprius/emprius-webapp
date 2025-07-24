import React, { useState } from 'react'
import { useTools } from '~components/Tools/queries'
import { ToolList } from '~components/Tools/List'
import { MainContainer } from '~components/Layout/LayoutComponents'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'
import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Stack,
  Switch,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { DebouncedSearchBar } from '~components/Layout/Search/DebouncedSearchBar'
import { SearchAndPagination } from '~components/Layout/Search/SearchAndPagination'
import { useTranslation } from 'react-i18next'

export const List = () => (
  <SearchAndPagination>
    <PaginatedList />
  </SearchAndPagination>
)

const PaginatedList = () => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const [showHeldTools, setShowHeldTools] = useState(true)
  const { data: toolsResponse, isLoading, error, isError } = useTools(showHeldTools)

  const handleSwitchChange = (_: React.ChangeEvent<HTMLInputElement>) => {
    setShowHeldTools((prev) => !prev)
  }

  return (
    <MainContainer>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        w={'full'}
        justifyContent={'space-between'}
        align={'start'}
        mb={4}
        gap={4}
      >
        <Heading size='lg'>{t('tools.my_tools', { defaultValue: 'My Tools' })}</Heading>
        <Flex direction={'column'} maxW='600px' w='full' flex={1} gap={2}>
          <HStack bg={bgColor} borderColor={borderColor} borderRadius='2xl' flex={1} maxW='600px' w='full'>
            <DebouncedSearchBar
              placeholder={t('tools.filter_tools', { defaultValue: 'Filter by tool name or description' })}
            />
          </HStack>
          <FormControl display='flex' alignItems='center' gap={2} justifyContent={{ base: 'start', md: 'end' }}>
            <Switch id='show-held' onChange={handleSwitchChange} isChecked={showHeldTools} />
            <FormLabel mb={0} htmlFor='show-held'>
              {t('tools.show_held_tools', { defaultValue: 'Show held tools' })}
            </FormLabel>
          </FormControl>
        </Flex>
      </Stack>
      <ToolList tools={toolsResponse?.tools || []} isLoading={isLoading} error={error} isError={isError} />
      {toolsResponse?.pagination?.pages > 1 && (
        <HStack w={'full'} justifyContent={'center'} mt={4}>
          <VStack
            bg={bgColor}
            minW={124}
            w={'min-content'}
            p={4}
            borderWidth={1}
            borderColor={borderColor}
            borderRadius='lg'
          >
            <RoutedPagination pagination={toolsResponse?.pagination} />
          </VStack>
        </HStack>
      )}
    </MainContainer>
  )
}
