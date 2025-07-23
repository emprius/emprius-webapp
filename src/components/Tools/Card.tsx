import { Box, Center, Divider, Flex, HStack, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink, useMatch } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { CostDay } from '~components/Tools/shared/CostDay'
import { AvailabilityToggle, EditToolButton } from '~components/Tools/shared/OwnerToolButtons'
import { ToolDTO } from '~components/Tools/types'
import { ROUTES } from '~src/router/routes'
import { ToolImageAvailability } from './shared/ToolImage'
import ToolTitle from '~components/Tools/shared/ToolTitle'
import { useTool } from '~components/Tools/queries'

interface ToolCardProps {
  tool: ToolDTO
}

export const ToolCard = ({ tool: toolData }: ToolCardProps) => {
  const { data: tool } = useTool(toolData.id.toString(), { initialData: toolData, enabled: false }) // Used to invalidate queries when is a list

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { user } = useAuth()
  const match = useMatch(ROUTES.USERS.TABS.TOOLS)

  let currentlyHolding = tool?.actualUserId === user?.id && tool?.userId !== user?.id
  let isGranted = tool?.userId === user?.id && tool?.actualUserId && tool?.actualUserId !== user?.id
  let isHolder = false
  // If is user tools page, check if the tool is held by the user
  if (match) {
    const pageUserId = match?.params?.id
    isHolder = tool?.actualUserId && pageUserId === tool?.actualUserId && pageUserId !== tool?.userId
    isGranted = tool?.actualUserId && tool?.userId !== tool?.actualUserId && !isHolder
  }

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
          <ToolImageAvailability
            imageId={tool?.images?.length ? tool?.images[0] : ''}
            isAvailable={tool?.isAvailable}
            isLoading={!tool}
            alt={tool?.title}
            currentlyHolding={currentlyHolding}
            isHolder={isHolder}
            isGranted={isGranted}
          />
        </Box>

        <Stack p={4} spacing={3}>
          <Stack spacing={1}>
            <Flex align='start' justify='space-between' gap={2}>
              <ToolTitle
                fontWeight='semibold'
                fontSize='lg'
                _hover={{ color: 'primary.500', textDecoration: 'none' }}
                noOfLines={2}
                flex='1'
                tool={tool}
              />
              <CostDay tool={tool} />
            </Flex>

            <Text fontSize='md' noOfLines={2} title={tool.description} color='lightText'>
              {tool.description}
            </Text>
          </Stack>
        </Stack>
      </Link>
      {user?.id === tool.userId && (
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
