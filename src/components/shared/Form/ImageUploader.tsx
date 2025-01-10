import React, { useCallback, useState, useRef, forwardRef } from 'react'
import {
  Box,
  Image,
  SimpleGrid,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  VisuallyHidden,
} from '@chakra-ui/react'
import { CloseIcon, AddIcon } from '@chakra-ui/icons'

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

    const handleFileChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return

        // Create a DataTransfer object to combine existing and new files
        const dataTransfer = new DataTransfer()
        
        // Add existing files from the input
        const existingInput = document.querySelector(`input[name="${name}"]`) as HTMLInputElement
        if (existingInput?.files) {
          Array.from(existingInput.files).forEach(file => {
            dataTransfer.items.add(file)
          })
        }
        
        // Add new files
        Array.from(files).forEach(file => {
          dataTransfer.items.add(file)
        })

        // Create preview URLs for new files
        const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file))
        setPreviews((prev) => [...prev, ...newPreviews])

        // Create a new change event with all files
        const newEvent = {
          target: {
            name,
            files: dataTransfer.files
          }
        } as unknown as React.ChangeEvent<HTMLInputElement>

        // Call the original onChange from react-hook-form
        onChange(newEvent)

        // Reset the file input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      },
      [name, onChange]
    )

    const removeImage = useCallback(
      (index: number) => {
        const dataTransfer = new DataTransfer()
        const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement
        const files = input?.files
        
        if (files) {
          Array.from(files).forEach((file, i) => {
            if (i !== index) {
              dataTransfer.items.add(file)
            }
          })

          // Create a new change event
          const newEvent = {
            target: {
              name,
              files: dataTransfer.files
            }
          } as unknown as React.ChangeEvent<HTMLInputElement>

          // Update previews
          setPreviews((prev) => {
            const newPreviews = prev.filter((_, i) => i !== index)
            URL.revokeObjectURL(prev[index])
            return newPreviews
          })

          // Call the original onChange with our synthetic event
          onChange(newEvent)
        }
      },
      [name, onChange]
    )

    const handleButtonClick = () => {
      fileInputRef.current?.click()
    }

    React.useEffect(() => {
      // Cleanup preview URLs when component unmounts
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
            aria-hidden="false"
          />
        </VisuallyHidden>
        
        <Button
          leftIcon={<AddIcon />}
          onClick={handleButtonClick}
          colorScheme='blue'
          mb={4}
        >
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
