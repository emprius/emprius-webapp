import { CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  VisuallyHidden,
} from '@chakra-ui/react'
import React, { forwardRef, useCallback, useRef, useState } from 'react'
import { icons } from '~theme/icons'

interface ImageUploaderProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
  name: string
  error?: string
  isRequired?: boolean
  label?: string
}

export const ImageUploader = forwardRef<HTMLInputElement, ImageUploaderProps>(
  ({ onChange, onBlur, name, error, isRequired = false, label = 'Images' }, ref) => {
    const [previews, setPreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [files, setFiles] = useState<File[]>([])

    const handleFileChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files
        if (!newFiles) return

        const filesArray = Array.from(newFiles)

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
    React.useEffect(() => {
      if (fileInputRef.current && files.length > 0) {
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
      }
    }, [files, onChange])

    // Cleanup preview URLs when component unmounts
    React.useEffect(() => {
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
            accept='image/*'
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

        <Button leftIcon={icons.add({})} onClick={handleButtonClick} mb={4}>
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

ImageUploader.displayName = 'ImageUploader'
