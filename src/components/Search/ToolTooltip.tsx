import { Box, Flex, HStack, Icon, Stack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { Link as RouterLink } from 'react-router-dom'
import { CostDay } from '~components/Tools/shared/CostDay'
import { ToolImageAvailability } from '~components/Tools/shared/ToolImage'
import type { Tool } from '~components/Tools/types'
import { ROUTES } from '~src/router/routes'
import ToolTitle from '~components/Tools/shared/ToolTitle'

interface ToolTooltipProps {
  tools: Tool[]
}

export const ToolTooltip = ({ tools }: ToolTooltipProps) => {
  const [currentPage, setCurrentPage] = useState(0)

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent closing the popup
    e.stopPropagation() // Prevent event bubbling
    setCurrentPage((prev) => (prev + 1) % tools.length)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent closing the popup
    e.stopPropagation() // Prevent event bubbling
    setCurrentPage((prev) => (prev - 1 + tools.length) % tools.length)
  }

  const tool = tools[currentPage]

  return (
    <Stack spacing={1} width='260px' pt={6} pb={4} gap={2}>
      <Stack as={RouterLink} to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}>
        <ToolImageAvailability
          imageId={tool?.images?.[0] ?? ''}
          isAvailable={tool.isAvailable}
          isLoading={!tool}
          toolId={tool.id}
          alt={tool.title}
          height='120px'
        />
        <Flex align='top' justify='space-between' gap={2} px={4}>
          <ToolTitle
            fontWeight='semibold'
            fontSize='lg'
            // _hover={{ color: 'primary.500', textDecoration: 'none' }}
            color={'primary.500'}
            noOfLines={2}
            flex='1'
            tool={tool}
          />
          <CostDay tool={tool} fontSize='lg' />
        </Flex>
        <Box fontSize='sm' color='gray.600' noOfLines={2} px={4}>
          {tool.description}
        </Box>
      </Stack>
      {tools.length > 1 && (
        <HStack justify='center' spacing={2} px={4} py={1}>
          <Box
            cursor={'pointer'}
            display='flex'
            justifyContent='end'
            borderRadius='md'
            _hover={{ bg: 'gray.100' }}
            onClick={handlePrev}
            py={1}
            flex={1}
          >
            <Icon as={GrPrevious} aria-label='Previous tool' size='sm' boxSize={5} color={'primary.500'} />
          </Box>
          <Text fontSize='sm'>
            {currentPage + 1} / {tools.length}
          </Text>
          <Box
            cursor={'pointer'}
            display='flex'
            justifyContent='start'
            borderRadius='md'
            _hover={{ bg: 'gray.100' }}
            onClick={handleNext}
            py={1}
            flex={1}
          >
            <Icon as={GrNext} aria-label='Next tool' size='sm' boxSize={5} color={'primary.500'} />
          </Box>
        </HStack>
      )}
    </Stack>
  )
}
