import React, { useRef, useState } from 'react'
import { Avatar as ChakraAvatar, Box, IconButton, Image, useToast } from '@chakra-ui/react'
import { ServerImage } from '~src/components/shared/ServerImage'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { ASSETS } from '~src/constants'

interface AvatarUploadProps {
  currentAvatar?: string // This will be the imageId
  onAvatarChange?: (file: File | '') => void
  username?: string
  showControls?: boolean
}

export const Avatar: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  username,
  showControls = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const [previewUrl, setPreviewUrl] = useState<string | undefined>()

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      onAvatarChange && onAvatarChange(file)
    } catch (error) {
      toast({
        title: 'Error uploading image',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleOnAvatarDelete = () => {
    setPreviewUrl(ASSETS.AVATAR_FALLBACK)
    onAvatarChange && onAvatarChange('')
  }

  return (
    <Box position='relative' width='150px' height='150px'>
      {showControls && previewUrl ? (
        <Image src={previewUrl} alt='Avatar' borderRadius='full' boxSize='150px' objectFit='cover' />
      ) : username && !currentAvatar ? (
        <ChakraAvatar name={username} size='2xl' />
      ) : (
        <ServerImage
          imageId={currentAvatar || ''}
          fallbackSrc={ASSETS.AVATAR_FALLBACK}
          alt='Avatar'
          borderRadius='full'
          boxSize='150px'
          objectFit='cover'
        />
      )}
      {showControls && (
        <>
          <IconButton
            aria-label='Edit avatar'
            icon={<EditIcon />}
            position='absolute'
            bottom='0'
            right='0'
            colorScheme='blue'
            rounded='full'
            onClick={() => onAvatarChange && inputRef.current?.click()}
          />
          <IconButton
            aria-label='Delete avatar'
            icon={<DeleteIcon />}
            position='absolute'
            top='0'
            right='0'
            colorScheme='red'
            rounded='full'
            size='sm'
            onClick={handleOnAvatarDelete}
          />
        </>
      )}
      <input type='file' ref={inputRef} onChange={handleImageChange} accept='image/*' style={{ display: 'none' }} />
    </Box>
  )
}
