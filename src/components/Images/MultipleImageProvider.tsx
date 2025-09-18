import React, { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react'
import { ACCEPTED_IMG_TYPES } from '~utils/images'

export type ImagePreview = {
  file: File
  url: string
  id: string
}

type ImagePreviewContextType = {
  previews: ImagePreview[]
  files: File[]
  addImages: (newFiles: FileList | File[]) => void
  removeImage: (id: string) => void
  clearImages: () => void
  updateFileInput: (inputRef: React.RefObject<HTMLInputElement>) => void
}

const ImagePreviewContext = createContext<ImagePreviewContextType | null>(null)

export const useImagePreview = () => {
  const context = useContext(ImagePreviewContext)
  if (!context) {
    throw new Error('useImagePreview must be used within an ImagePreviewProvider')
  }
  return context
}

type ImagePreviewProviderProps = {
  children: React.ReactNode
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const MultipleImageProvider: React.FC<ImagePreviewProviderProps> = ({ children, onChange }) => {
  const [previews, setPreviews] = useState<ImagePreview[]>([])
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Generate unique ID for each image
  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Create synthetic change event for form integration
  const createSyntheticEvent = useCallback((input: HTMLInputElement): React.ChangeEvent<HTMLInputElement> => {
    return {
      target: input,
      currentTarget: input,
      type: 'change',
      bubbles: true,
      cancelable: true,
      timeStamp: Date.now(),
    } as unknown as React.ChangeEvent<HTMLInputElement>
  }, [])

  // Update file input with current files
  const updateFileInputFiles = useCallback((input: HTMLInputElement, filesList: File[]) => {
    const dataTransfer = new DataTransfer()
    filesList.forEach((file) => dataTransfer.items.add(file))
    input.files = dataTransfer.files
  }, [])

  const addImages = useCallback(
    (newFiles: FileList | File[]) => {
      const filesArray = Array.isArray(newFiles) ? newFiles : Array.from(newFiles)

      // Filter files directly instead of using the problematic filterBySupportedTypes function
      const validFiles = filesArray.filter((file) => {
        const isValid = ACCEPTED_IMG_TYPES.includes(file.type)
        if (!isValid) {
          console.warn(`File "${file.name}" was rejected. Only JPG and PNG formats are allowed.`)
        }
        return isValid
      })

      if (validFiles.length === 0) return

      // Create new previews with unique IDs
      const newPreviews: ImagePreview[] = validFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        id: generateId(),
      }))

      // Update state
      setPreviews((prev) => [...prev, ...newPreviews])
      setFiles((prev) => {
        const updatedFiles = [...prev, ...validFiles]

        // Update file input if available
        if (fileInputRef.current) {
          updateFileInputFiles(fileInputRef.current, updatedFiles)

          // Trigger onChange event
          if (onChange) {
            onChange(createSyntheticEvent(fileInputRef.current))
          }
        }

        return updatedFiles
      })
    },
    [generateId, onChange, createSyntheticEvent, updateFileInputFiles]
  )

  const removeImage = useCallback(
    (id: string) => {
      let previewToRemove: ImagePreview | undefined

      setPreviews((prev) => {
        previewToRemove = prev.find((p) => p.id === id)
        if (previewToRemove) {
          URL.revokeObjectURL(previewToRemove.url)
        }
        return prev.filter((p) => p.id !== id)
      })

      setFiles((prev) => {
        if (!previewToRemove) return prev

        const updatedFiles = prev.filter((file) => file !== previewToRemove!.file)

        // Update file input if available
        if (fileInputRef.current) {
          updateFileInputFiles(fileInputRef.current, updatedFiles)

          // Trigger onChange event
          if (onChange) {
            onChange(createSyntheticEvent(fileInputRef.current))
          }
        }

        return updatedFiles
      })
    },
    [onChange, createSyntheticEvent, updateFileInputFiles]
  )

  const clearImages = useCallback(() => {
    // Revoke all object URLs to prevent memory leaks
    previews.forEach((preview) => URL.revokeObjectURL(preview.url))

    // Clear states
    setPreviews([])
    setFiles([])

    // Clear file input if available
    if (fileInputRef.current) {
      fileInputRef.current.value = ''

      // Trigger onChange event
      if (onChange) {
        onChange(createSyntheticEvent(fileInputRef.current))
      }
    }
  }, [previews, onChange, createSyntheticEvent])

  const updateFileInput = useCallback(
    (inputRef: React.RefObject<HTMLInputElement>) => {
      if (inputRef.current) {
        fileInputRef.current = inputRef.current

        // Initialize with current files
        if (files.length > 0) {
          updateFileInputFiles(inputRef.current, files)
        }
      }
    },
    [files, updateFileInputFiles]
  )

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [])

  const value: ImagePreviewContextType = {
    previews,
    files,
    addImages,
    removeImage,
    clearImages,
    updateFileInput,
  }

  return <ImagePreviewContext.Provider value={value}>{children}</ImagePreviewContext.Provider>
}
