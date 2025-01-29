import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  Stack,
  Switch,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { UpdateToolParams, useDeleteTool, useUpdateTool } from '~components/Tools/toolsQueries'
import { Tool } from '~components/Tools/types'

import { ROUTES } from '~src/router/routes'

export const OwnerToolButtons = ({ tool }: { tool: Tool }) => {
  const { user } = useAuth()

  const isOwner = user?.id === tool.userId

  if (!isOwner) {
    return null
  }

  return (
    <Stack direction='row' pb={4} pr={4} spacing={2} align='center' justify='flex-end' width='fit-content' ml='auto'>
      <AvailabilityToggle tool={tool} />
      <EditToolButton toolId={tool.id} />
      <DeleteToolButton tool={tool} />
    </Stack>
  )
}

export const EditToolButton = ({ toolId }: { toolId: number }) => {
  const { t } = useTranslation()

  return (
    <IconButton
      as={RouterLink}
      to={ROUTES.TOOLS.EDIT.replace(':id', toolId.toString())}
      icon={<FiEdit2 />}
      aria-label={t('tools.edit')}
      size='md'
      colorScheme='blue'
      onClick={(e) => {
        e.stopPropagation()
      }}
    />
  )
}

export const AvailabilityToggle = ({ tool }: { tool: Tool }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const updateTool = useUpdateTool()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const newAvailability = !tool.isAvailable

  const handleConfirmToggle = useCallback(async () => {
    try {
      const updateParams: Partial<UpdateToolParams> = {
        id: tool.id.toString(),
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
      <Switch size='lg' isChecked={tool.isAvailable} onChange={onOpen} colorScheme='green' />

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
              <Button ref={cancelRef} onClick={onClose}>
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

export const DeleteToolButton = ({ tool }: { tool: Tool }) => {
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
      <IconButton icon={<FiTrash2 />} aria-label={t('tools.delete')} size='md' colorScheme='red' onClick={onOpen} />

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
