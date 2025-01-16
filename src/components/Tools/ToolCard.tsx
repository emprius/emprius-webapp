import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  IconButton,
  Link,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { Tool } from '~components/Tools/types'
import { ToolImage, ToolPriceRating } from './shared'
import { UpdateToolParams, useDeleteTool, useUpdateTool } from './toolsQueries'

interface ToolCardProps {
  tool: Tool
}

const EditToolButton = ({ toolId }: { toolId: number }) => {
  const { t } = useTranslation()

  return (
    <IconButton
      as={RouterLink}
      to={`/tools/${toolId}/edit`}
      icon={<FiEdit2 />}
      aria-label={t('tools.edit')}
      size='sm'
      colorScheme='blue'
      onClick={(e) => {
        e.stopPropagation()
      }}
    />
  )
}

const AvailabilityToggle = ({ tool }: { tool: Tool }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const updateTool = useUpdateTool()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const newAvailability = !tool.isAvailable
  // const [newAvailability, setNewAvailability] = React.useState(tool.isAvailable)

  const handleConfirmToggle = useCallback(async () => {
    try {
      const updateParams: Partial<UpdateToolParams> = {
        id: tool.id.toString(),
        // title: tool.title,
        // description: tool.description,
        // mayBeFree: tool.mayBeFree,
        // askWithFee: tool.askWithFee,
        // cost: tool.cost,
        // images: tool.images.map(img => img.hash),
        // transportOptions: tool.transportOptions || [],
        // category: tool.toolCategory,
        // location: tool.location,
        // estimatedValue: tool.estimatedValue,
        // height: tool.height,
        // weight: tool.weight,
        isAvailable: newAvailability,
      }
      await updateTool.mutateAsync(updateParams)
      toast({
        title: t('tools.availability_updated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      console.error(error)
      toast({
        title: t('common.error'),
        description: t('tools.update_failed'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }, [tool, newAvailability, updateTool, toast, t, onClose])

  return (
    <>
      <Switch
        size='sm'
        isChecked={tool.isAvailable}
        onChange={(e) => onOpen()} // Controlled by modal
        colorScheme='green'
      />

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {t('tools.availability_confirmation_title')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {newAvailability
                ? t('tools.make_available_confirmation_message')
                : t('tools.make_unavailable_confirmation_message')}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  // setNewAvailability(tool.isAvailable) // Reset on cancel
                  onClose()
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button colorScheme='blue' onClick={handleConfirmToggle} ml={3}>
                {t('common.confirm')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

const DeleteToolButton = ({ tool }: { tool: Tool }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const deleteTool = useDeleteTool()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  const handleDelete = useCallback(async () => {
    try {
      await deleteTool.mutateAsync(tool.id.toString())
      toast({
        title: t('tools.deleted'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('tools.delete_failed'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }, [tool.id, deleteTool, toast, t, onClose])

  return (
    <>
      <IconButton icon={<FiTrash2 />} aria-label={t('tools.delete')} size='sm' colorScheme='red' onClick={onOpen} />

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {t('tools.delete_confirmation_title')}
            </AlertDialogHeader>

            <AlertDialogBody>{t('tools.delete_confirmation_message')}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme='red' onClick={handleDelete} ml={3}>
                {t('common.delete')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const { user } = useAuth()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const isOwner = user?.email === tool.userId

  return (
    <Box
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius='lg'
      overflow='hidden'
      transition='transform 0.2s'
      _hover={{ transform: 'translateY(-4px)' }}
    >
      <Box position='relative'>
        <ToolImage imageHash={tool.images[0]?.hash} title={tool.title} isAvailable={tool.isAvailable} />
      </Box>

      <Stack p={4} spacing={3}>
        <Stack spacing={1}>
          <Link
            as={RouterLink}
            to={`/tools/${tool.id}`}
            fontWeight='semibold'
            fontSize='lg'
            _hover={{ color: 'primary.500', textDecoration: 'none' }}
          >
            {tool.title}
          </Link>
          <ToolPriceRating cost={tool.cost} rating={tool.rating} />
        </Stack>

        <Text color='gray.600' noOfLines={2} title={tool.description}>
          {tool.description}
        </Text>
        {isOwner && (
          <Stack direction='row' spacing={2} align='center' justify='flex-end'>
            <EditToolButton toolId={tool.id} />
            <AvailabilityToggle tool={tool} />
            <DeleteToolButton tool={tool} />
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
