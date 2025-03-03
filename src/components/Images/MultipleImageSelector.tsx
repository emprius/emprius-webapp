import { CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  VisuallyHidden,
} from '@chakra-ui/react'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { icons } from '~theme/icons'
import { filterBySupportedTypes, INPUT_ACCEPTED_IMAGE_TYPES } from '~utils/images'
import { UseFormRegisterReturn } from 'react-hook-form/dist/types/form'

type ImageUploaderProps = {
  name: string
  error?: string
  isRequired?: boolean
  label?: string
  fileList?: FileList // Use fileList to monitor when value becomes null to clear images
} & ButtonProps &
  UseFormRegisterReturn

export const MultipleImageSelector = forwardRef<HTMLInputElement, ImageUploaderProps>(
  ({ fileList: value, onChange, onBlur, name, error, isRequired = false, label = 'Images', ...props }, ref) => {
    const [previews, setPreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<File[]>([])

    // Function to clear all images
    const clearImages = useCallback(() => {
      // Revoke all object URLs to prevent memory leaks
      previews.forEach((url) => URL.revokeObjectURL(url))

      // Clear the states
      setPreviews([])
      setFiles([])

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''

        // Create a synthetic change event to notify the form
        const syntheticEvent = {
          target: fileInputRef.current,
          currentTarget: fileInputRef.current,
          type: 'change',
          bubbles: true,
          cancelable: true,
          timeStamp: Date.now(),
        } as unknown as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }, [previews, onChange])

    const handleFileChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files
        if (!newFiles) return

        const filesArray = filterBySupportedTypes(newFiles)

        if (filesArray.length === 0) return

        // Update files state and create DataTransfer object
        setFiles((prev) => {
          const updatedFiles = [...prev, ...filesArray]

          // Create a new DataTransfer object with all files
          const dataTransfer = new DataTransfer()
          updatedFiles.forEach((file) => dataTransfer.items.add(file))

          // Update the file input's files
          if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files
          }

          return updatedFiles
        })

        // Create preview URLs for new files
        const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
        setPreviews((prev) => [...prev, ...newPreviews])

        // Create a change event with all files
        if (fileInputRef.current) {
          const syntheticEvent = {
            target: fileInputRef.current,
            currentTarget: fileInputRef.current,
            type: 'change',
            bubbles: true,
            cancelable: true,
            timeStamp: Date.now(),
          } as unknown as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }
      },
      [onChange]
    )

    const removeImage = useCallback(
      (index: number) => {
        // Update files array
        setFiles((prev) => {
          const newFiles = prev.filter((_, i) => i !== index)

          // Create a new DataTransfer object with remaining files
          const dataTransfer = new DataTransfer()
          newFiles.forEach((file) => dataTransfer.items.add(file))

          // Create a change event with the updated files
          if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files
            const syntheticEvent = {
              target: fileInputRef.current,
              currentTarget: fileInputRef.current,
              type: 'change',
              bubbles: true,
              cancelable: true,
              timeStamp: Date.now(),
            } as unknown as React.ChangeEvent<HTMLInputElement>
            onChange(syntheticEvent)
          }

          return newFiles
        })

        // Update previews
        setPreviews((prev) => {
          const newPreviews = prev.filter((_, i) => i !== index)
          URL.revokeObjectURL(prev[index])
          return newPreviews
        })
      },
      [name, onChange]
    )

    const handleButtonClick = () => {
      fileInputRef.current?.click()
    }

    // Initialize file input with files when component mounts and trigger onChange
    useEffect(() => {
      if (fileInputRef.current) {
        if (files.length > 0) {
          const dataTransfer = new DataTransfer()
          files.forEach((file) => dataTransfer.items.add(file))
          fileInputRef.current.files = dataTransfer.files

          // Trigger onChange to ensure form is aware of files
          const syntheticEvent = {
            target: fileInputRef.current,
            currentTarget: fileInputRef.current,
            type: 'change',
            bubbles: true,
            cancelable: true,
            timeStamp: Date.now(),
          } as unknown as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        } else {
          // If files array is empty, clear the file input
          fileInputRef.current.value = ''
        }
      }
    }, [files, onChange])

    // Watch for form reset by monitoring when the value becomes null
    useEffect(() => {
      // This effect will run when the component receives a new value from the form
      // If the form is reset, the ref.current.files will be null or empty
      const handleFormReset = () => {
        if (fileInputRef.current && (!fileInputRef.current.files || fileInputRef.current.files.length === 0)) {
          // Only clear if we actually have images to clear
          if (files.length > 0 || previews.length > 0) {
            clearImages()
          }
        }
      }

      // Check on mount and when the ref changes
      handleFormReset()

      // We can't directly watch for changes to fileInputRef.current.files,
      // but we can set up a MutationObserver to detect when the form might be reset
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
    }, [files, previews, clearImages, value])

    // Expose the clearImages method to parent components through the ref
    useImperativeHandle(ref, () => {
      // Return the actual input element but augment it with our clearImages method
      const input = fileInputRef.current as HTMLInputElement & { clearImages?: () => void }
      if (input) {
        input.clearImages = clearImages
      }
      return input
    }, [clearImages])

    // Cleanup preview URLs when component unmounts
    useEffect(() => {
      return () => {
        previews.forEach((url) => URL.revokeObjectURL(url))
      }
    }, [])

    return (
      <FormControl isRequired={isRequired} isInvalid={!!error}>
        <FormLabel>{label}</FormLabel>
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

        <Button leftIcon={icons.add({})} onClick={handleButtonClick} mb={4} {...props}>
          Add Images
        </Button>

        <FormErrorMessage>{error}</FormErrorMessage>

        <SimpleGrid columns={[2, 3, 4]} spacing={4} mt={4}>
          {previews.map((preview, index) => (
            <Box key={preview} position='relative'>
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                objectFit='cover'
                w='100%'
                h='100px'
                borderRadius='md'
              />
              <IconButton
                aria-label='Remove image'
                icon={<CloseIcon />}
                size='sm'
                position='absolute'
                top={1}
                right={1}
                onClick={() => removeImage(index)}
                colorScheme='red'
                variant='solid'
              />
            </Box>
          ))}
        </SimpleGrid>
      </FormControl>
    )
  }
)

MultipleImageSelector.displayName = 'ImageUploader'
