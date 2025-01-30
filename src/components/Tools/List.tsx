import { Box, Button, Container, SimpleGrid } from '@chakra-ui/react'
import { ROUTES } from '~src/router/routes'
import { AddIcon } from '@chakra-ui/icons'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { ToolCard } from '~components/Tools/Card'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Tool } from '~components/Tools/types'
import { icons } from '~theme/icons'

export const ToolList = ({ tools }: { tools: Tool[] }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Container maxW='container.xl' py={8} position='relative'>
      <Button
        position='fixed'
        top='6rem'
        left='50%'
        transform='translateX(-50%)'
        leftIcon={<AddIcon />}
        zIndex={2}
        as={RouterLink}
        to={ROUTES.TOOLS.NEW}
        size='lg'
        variant={'floating'}
        colorScheme='blue'
      >
        {t('tools.add_tool')}
      </Button>

      <Box flex={1} mt={20}>
        {tools.length === 0 ? (
          <ElementNotFound icon={icons.tools} title={t('tools.no_tools_found')} desc={t('tools.no_tools_found_desc')} />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Container>
  )
}
