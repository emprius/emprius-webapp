import { Box, Center, Divider, Flex, HStack, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Tool } from '~components/Tools/types'
import { ToolImage } from './shared/ToolImage'
import { ToolBadges } from '~components/Tools/shared/ToolBadges'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '~src/router/routes'
import { lightText } from '~theme/common'
import { useAuth } from '~components/Auth/AuthContext'
import { AvailabilityToggle, EditToolButton } from '~components/Tools/shared/OwnerToolButtons'

interface ToolCardProps {
  tool: Tool
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { user } = useAuth()
  const isOwner = user?.id === tool.userId

  return (
    <Flex
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius='lg'
      overflow='hidden'
      transition='transform 0.2s'
      _hover={{ transform: 'translateY(-4px)', cursor: 'pointer' }}
      justify={'space-between'}
      direction={'column'}
    >
      <Link
        as={RouterLink}
        to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}
        fontWeight='semibold'
        fontSize='lg'
        _hover={{ color: 'primary.500', textDecoration: 'none' }}
      >
        <Box position='relative'>
          <ToolImage
            imageHash={tool?.images?.length ? tool?.images[0] : ''}
            title={tool.title}
            isAvailable={tool.isAvailable}
          />
        </Box>

        <Stack p={4} spacing={3}>
          <Stack spacing={1}>
            <Flex align='top' justify='space-between' gap={2}>
              <Text
                fontWeight='semibold'
                fontSize='lg'
                _hover={{ color: 'primary.500', textDecoration: 'none' }}
                noOfLines={2}
                flex='1'
              >
                {tool.title}
              </Text>
              <Text fontSize='lg' fontWeight='bold' sx={lightText} whiteSpace='nowrap'>
                {t('tools.cost_unit', { cost: tool.cost })}
              </Text>
            </Flex>
            <ToolBadges tool={tool} />

            <Text fontSize='md' noOfLines={2} title={tool.description} sx={lightText}>
              {tool.description}
            </Text>
          </Stack>
        </Stack>
      </Link>
      {isOwner && (
        <HStack justify={'space-between'} borderTop={'1px solid'} borderColor={'gray.200'}>
          <Flex align={'center'} justify={'center'} flex={1} py={1}>
            <EditToolButton toolId={tool.id} />
          </Flex>
          <Center height='50px'>
            <Divider orientation={'vertical'} />
          </Center>
          <Flex align={'center'} justify={'center'} flex={1} py={1}>
            <AvailabilityToggle tool={tool} />
          </Flex>
        </HStack>
      )}
    </Flex>
  )
}
