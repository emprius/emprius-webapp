import { Container, FormControl, FormLabel, Grid, GridItem, Select, Stack, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ToolCard } from '~components/Tools/ToolCard'
import { useTools } from '~components/Tools/toolsQueries'
import { TOOL_CATEGORIES } from '~utils/constants'

export const ToolsListPage = () => {
  const { t } = useTranslation()
  const { data: toolsResponse, isLoading } = useTools()
  const bgColor = useColorModeValue('white', 'gray.800')

  if (isLoading) {
    return <LoadingSpinner />
  }

  const tools = toolsResponse?.tools || []

  return (
    <Container maxW='container.xl' py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={8}>
        <GridItem>
          <Stack spacing={6} position='sticky' top='20px' bg={bgColor} p={6} borderRadius='lg' boxShadow='sm'>
            <FormControl>
              <FormLabel>{t('tools.category')}</FormLabel>
              <Select defaultValue=''>
                <option value=''>{t('tools.allCategories')}</option>
                {TOOL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {t(`categories.${category}`)}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </GridItem>

        <GridItem>
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              xl: 'repeat(3, 1fr)',
            }}
            gap={6}
          >
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </Grid>
        </GridItem>
      </Grid>
    </Container>
  )
}
