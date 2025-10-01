import React from 'react'
import {
  Box,
  Flex,
  IconButton,
  Input,
  useColorModeValue,
  VStack,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FiSend, FiImage } from 'react-icons/fi'
import { ImagePreviewFlex, ImageSelector } from '~components/Images/MultipleImageSelector'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { MultipleImageProvider, useImagePreview } from '~components/Images/MultipleImageProvider'
import { useUploadImages } from '~components/Images/queries'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'
import { useSendMessage } from '~components/Messages/queries'
import { UseFormRegisterReturn } from 'react-hook-form/dist/types/form'

export interface MessageInputProps {
  onMessageSent: () => void
  placeholder?: string
  chatWith: string // User ID for private conversations
  maxImages?: number
}

export type MessageForm = {
  content: string
  images: FileList
}

export const MessageInput = ({ onMessageSent, placeholder, chatWith, maxImages = 10 }: MessageInputProps) => {
  const { t } = useTranslation()

  const methods = useForm<MessageForm>({
    mode: 'onChange',
    defaultValues: {
      content: '',
      images: undefined,
    },
  })

  const { register, getValues } = methods

  const validate = (data) => {
    const images = getValues('images')
    const content = getValues('content').trim() || ''
    const hasImages = images && images.length > 0

    if (!content && !hasImages) {
      return false
    }
    if (hasImages && images.length > maxImages) {
      return t('messages.error.too_many_images', {
        defaultValue: 'Too many images. Maximum {{max}} images allowed.',
        max: maxImages,
      })
    }

    return true
  }

  const imagesRegister = register('images', {
    validate,
  })

  return (
    <FormProvider {...methods}>
      <MultipleImageProvider onChange={imagesRegister.onChange}>
        <MessageInputForm
          onMessageSent={onMessageSent}
          placeholder={placeholder}
          chatWith={chatWith}
          maxImages={maxImages}
          validate={validate}
          imagesProps={imagesRegister}
        />
      </MultipleImageProvider>
    </FormProvider>
  )
}

const MessageInputForm = ({
  onMessageSent,
  placeholder,
  chatWith,
  validate,
  imagesProps,
}: MessageInputProps & {
  validate: (data: any) => string | boolean
  imagesProps: UseFormRegisterReturn<'images'>
}) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const { clearImages } = useImagePreview()
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
  } = useFormContext<MessageForm>()

  const {
    mutateAsync: uploadImages,
    isPending: uploadImagesIsPending,
    isError: isImageError,
    error: imageError,
  } = useUploadImages()

  // Send message mutation
  const { mutateAsync: sendMessage, isPending, error, isError } = useSendMessage()

  const handleSend = async (data: MessageForm) => {
    let imageHashes: string[] = []
    if (data.images.length) {
      imageHashes = await uploadImages(data.images)
    }

    const trimmedMessage = data.content?.trim() || ''

    await sendMessage({
      type: 'private',
      recipientId: chatWith,
      content: trimmedMessage || undefined,
      images: imageHashes,
    })
    clearImages()
    reset()
    onMessageSent()
  }

  const isSending = isPending || uploadImagesIsPending
  const sendButtonEnabled = isValid && !isSending

  return (
    <Box as={'form'} p={4} bg={bgColor} borderTop='1px' borderColor={borderColor} onSubmit={handleSubmit(handleSend)}>
      <VStack spacing={1}>
        <Flex w='full' gap={2}>
          <ImageSelector
            {...imagesProps}
            variant='ghost'
            leftIcon={<FiImage />}
            iconSpacing={0}
            iconButton
            disabled={isSending}
          />

          <Input
            placeholder={placeholder || t('messages.type_message', { defaultValue: 'Type a message...' })}
            disabled={isSending}
            {...register('content', {
              validate,
            })}
          />

          <IconButton
            aria-label={t('messages.send', { defaultValue: 'Send' })}
            icon={<FiSend />}
            isDisabled={!sendButtonEnabled}
            size='md'
            type='submit'
          />
        </Flex>

        {/* Error Messages */}
        {errors?.images?.message && (
          <FormControl isInvalid={!!errors.images} w='full'>
            <FormErrorMessage>{errors.images.message}</FormErrorMessage>
          </FormControl>
        )}
        {isImageError && <FormSubmitMessage isError={isImageError} error={imageError} />}
        {isError && <FormSubmitMessage isError={isError} error={error} />}
        <ImagePreviewFlex imageHeight={'70px'} gap={4} wrap={'wrap'} align={'start'} w={'full'} />
      </VStack>
    </Box>
  )
}
