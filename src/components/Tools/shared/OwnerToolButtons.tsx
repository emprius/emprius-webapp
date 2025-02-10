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
  IconButtonProps,
  Switch,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { UpdateToolParams, useDeleteTool, useUpdateTool } from '~components/Tools/queries'
import { Tool } from '~components/Tools/types'
import { ROUTES } from '~src/router/routes'

type ToolButtonProps = { toolId: number } & Omit<IconButtonProps, 'aria-label'>

export const EditToolButton = ({ toolId, ...props }: ToolButtonProps) => {
  const { t } = useTranslation()

  return (
    <IconButton
      as={RouterLink}
      to={ROUTES.TOOLS.EDIT.replace(':id', toolId.toString())}
      icon={<FiEdit2 />}
      aria-label={t('tools.edit')}
      size='sm'
      variant={'outline'}
      onClick={(e) => {
        e.stopPropagation()
      }}
      {...props}
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
      <Switch size='md' isChecked={tool.isAvailable} onChange={onOpen} />

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
              <Button onClick={handleConfirmToggle} ml={3}>
                {t('common.confirm')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export const DeleteToolButton = ({ toolId }: { toolId: number }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const deleteTool = useDeleteTool()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  const handleDelete = useCallback(async () => {
    try {
      await deleteTool.mutateAsync(toolId.toString())
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
  }, [toolId, deleteTool, toast, t, onClose])

  return (
    <Box>
      <Button leftIcon={<FiTrash2 />} aria-label={t('tools.delete')} size='md' colorScheme='red' onClick={onOpen}>
        {t('tools.delete')}
      </Button>

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
    </Box>
  )
}
