import { UseFormRegisterReturn } from 'react-hook-form/dist/types/form'
import { ImagePreview, MultipleImageProvider } from './MultipleImageProvider'
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  VisuallyHidden,
} from '@chakra-ui/react'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { icons } from '~theme/icons'
import { INPUT_ACCEPTED_IMAGE_TYPES } from '~utils/images'
import { useTranslation } from 'react-i18next'
import { useImagePreview } from './MultipleImageProvider'
import { CloseIcon } from '@chakra-ui/icons'

type ImageUploaderProps = {
  name: string
  error?: string
  isRequired?: boolean
  label?: string
  fileList?: FileList // Use fileList to monitor when value becomes null to clear images
  columns?: number | number[]
  spacing?: number
  imageHeight?: string
} & ButtonProps &
  UseFormRegisterReturn

export const MultipleImageSelector = forwardRef<HTMLInputElement, ImageUploaderProps>(
  (
    {
      fileList: value,
      onChange,
      onBlur,
      name,
      error,
      isRequired = false,
      label,
      columns,
      spacing,
      imageHeight,
      ...props
    },
    ref
  ) => {
    return (
      <MultipleImageProvider onChange={onChange}>
        <ImageSelector
          fileList={value}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          error={error}
          isRequired={isRequired}
          label={label}
          ref={ref}
          {...props}
        />
        <ImagePreviewGrid columns={columns} spacing={spacing} imageHeight={imageHeight} />
      </MultipleImageProvider>
    )
  }
)

MultipleImageSelector.displayName = 'MultipleImageSelector'

type ImageSelectorProps = {
  name: string
  error?: string
  isRequired?: boolean
  label?: string
  iconButton?: boolean
  fileList?: FileList // Use fileList to monitor when value becomes null to clear images
} & ButtonProps &
  UseFormRegisterReturn

export const ImageSelector = forwardRef<HTMLInputElement, ImageSelectorProps>(
  ({ fileList: value, onChange, onBlur, name, error, isRequired = false, label, iconButton, ...props }, ref) => {
    const { t } = useTranslation()
    const { addImages, clearImages, updateFileInput, files } = useImagePreview()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files
        if (!newFiles) return

        addImages(newFiles)

        // Also call the original onChange if provided
        if (onChange) {
          onChange(event)
        }
      },
      [addImages, onChange]
    )

    const handleButtonClick = () => {
      fileInputRef.current?.click()
    }

    // Update the provider with our file input reference
    useEffect(() => {
      updateFileInput(fileInputRef)
    }, [updateFileInput])

    // Watch for form reset by monitoring when the value becomes null
    useEffect(() => {
      const handleFormReset = () => {
        if (fileInputRef.current && (!fileInputRef.current.files || fileInputRef.current.files.length === 0)) {
          // Only clear if we actually have images to clear
          if (files.length > 0) {
            clearImages()
          }
        }
      }

      // Check on mount and when the ref changes
      handleFormReset()

      // Set up a MutationObserver to detect when the form might be reset
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
            handleFormReset()
          }
        }
      })

      if (fileInputRef.current) {
        observer.observe(fileInputRef.current, { attributes: true })
      }

      return () => {
        observer.disconnect()
      }
    }, [files, clearImages, value])

    // Expose the clearImages method to parent components through the ref
    useImperativeHandle(ref, () => {
      // Return the actual input element but augment it with our clearImages method
      const input = fileInputRef.current as HTMLInputElement & { clearImages?: () => void }
      if (input) {
        input.clearImages = clearImages
      }
      return input
    }, [clearImages])

    return (
      <FormControl isRequired={isRequired} isInvalid={!!error} width={'min-content'}>
        {label && <FormLabel>{label}</FormLabel>}
        <VisuallyHidden>
          <Input
            type='file'
            accept={INPUT_ACCEPTED_IMAGE_TYPES}
            multiple
            name={name}
            onChange={handleFileChange}
            onBlur={onBlur}
            ref={(e) => {
              // Handle both the internal ref and the forwarded ref
              fileInputRef.current = e
              if (typeof ref === 'function') {
                ref(e)
              } else if (ref) {
                ref.current = e
              }
            }}
            aria-hidden='false'
          />
        </VisuallyHidden>

        <Button leftIcon={icons.add({})} onClick={handleButtonClick} mb={files.length ? 4 : 0} {...props}>
          {!iconButton && t('common.add_images', { defaultValue: 'Add Images' })}
        </Button>

        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    )
  }
)

type ImagePreviewGridProps = {
  columns?: number | number[]
  spacing?: number
  imageHeight?: string
}

export const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({
  columns = [2, 3, 4],
  spacing = 4,
  imageHeight = '100px',
}) => {
  const { previews, removeImage } = useImagePreview()

  if (previews.length === 0) {
    return null
  }

  return (
    <SimpleGrid columns={columns} spacing={spacing}>
      {previews.map((preview) => (
        <Preview key={preview.id} imageHeight={imageHeight} preview={preview} onRemove={removeImage} />
      ))}
    </SimpleGrid>
  )
}

type ImagePreviewFlexProps = {
  columns?: number | number[]
  spacing?: number
  imageHeight?: string
} & FlexProps

export const ImagePreviewFlex: React.FC<ImagePreviewFlexProps> = ({ spacing = 4, imageHeight = '100px', ...props }) => {
  const { previews, removeImage, files } = useImagePreview()

  if (previews.length === 0) {
    return null
  }

  return (
    <Flex {...props}>
      {previews.map((preview) => (
        <Preview key={preview.id} imageHeight={imageHeight} preview={preview} onRemove={removeImage} />
      ))}
    </Flex>
  )
}

const Preview = ({
  preview,
  onRemove,
  imageHeight,
}: {
  preview: ImagePreview
  onRemove: (id: string) => void
  imageHeight: string
}) => (
  <Box key={preview.id} position='relative'>
    <Image
      src={preview.url}
      alt={`Preview ${preview.file.name}`}
      objectFit='cover'
      w='100%'
      h={imageHeight}
      borderRadius='md'
    />
    <IconButton
      aria-label='Remove image'
      icon={<CloseIcon />}
      size='sm'
      position='absolute'
      top={1}
      right={1}
      onClick={() => onRemove(preview.id)}
      colorScheme='red'
      variant='solid'
    />
  </Box>
)
