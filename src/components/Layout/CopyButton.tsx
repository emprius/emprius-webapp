import React from 'react'
import { IconButton, IconButtonProps, useToast } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'

interface CopyButtonProps extends Omit<IconButtonProps, 'onClick' | 'icon' | 'aria-label'> {
  text: string
  'aria-label'?: string
}

export const CopyButton = ({ text, 'aria-label': ariaLabel, ...props }: CopyButtonProps) => {
  const { t } = useTranslation()
  const toast = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: t('common.copied_to_clipboard', { defaultValue: 'Copied to clipboard!' }),
        description: t('common.copied_description', { 
          defaultValue: 'The content has been copied to your clipboard.' 
        }),
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Failed to copy:', error)
      toast({
        title: t('common.failed_to_copy', { defaultValue: 'Failed to copy' }),
        description: t('common.clipboard_error', { 
          defaultValue: 'Could not access clipboard. Please copy manually.' 
        }),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <IconButton
      aria-label={ariaLabel || t('common.copy_text', { defaultValue: 'Copy text' })}
      icon={<CopyIcon />}
      onClick={handleCopy}
      variant='ghost'
      size='sm'
      {...props}
    />
  )
}
