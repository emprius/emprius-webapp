import React from 'react'
import { CommunityDetail } from '~components/Communities/Detail'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { useCustomPageTitle } from '~components/Layout/Contexts/TitleContext'
import { MainContainer } from '~components/Layout/LayoutComponents'
import { Box, Flex, Stack, useColorModeValue } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { icons } from '~theme/icons'
import { useCommunityDetail } from '~components/Communities/queries'
import { RoutedTabs, TabConfig } from '~components/Layout/RoutedTabs'
import { ROUTES } from '~src/router/routes'
import { CommunityMembers } from '~components/Communities/CommunityMembers'
import { CommunitySharedTools } from '~components/Communities/CommunitySharedTools'

export const Detail = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data: community, isLoading, isError } = useCommunityDetail(id!)
  useCustomPageTitle(community?.name)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError || !community) {
    return (
      <ElementNotFound
        icon={icons.communities}
        title={t('communities.not_found')}
        desc={t('communities.not_found_desc')}
      />
    )
  }

  const tabs: TabConfig[] = [
    {
      path: ROUTES.COMMUNITIES.TABS.MEMBERS.replace(':id', id!),
      label: t('communities.members'),
      content: <CommunityMembers />,
    },
    {
      path: ROUTES.COMMUNITIES.TABS.TOOLS.replace(':id', id!),
      label: t('communities.shared_tools'),
      content: <CommunitySharedTools />,
    },
  ]

  return (
    <MainContainer>
      <Flex gap={2} align='center' direction={'column'} w={'full'}>
        <CommunityDetail />
        <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor} w={'full'} mt={4}>
          <RoutedTabs tabs={tabs} defaultPath={ROUTES.COMMUNITIES.TABS.MEMBERS.replace(':id', id!)} />
        </Box>
      </Flex>
    </MainContainer>
  )
}
