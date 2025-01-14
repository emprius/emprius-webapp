import React, { useRef, useState } from 'react'
import { Box, IconButton, Image, useToast } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { ASSETS } from '~src/constants'
import { Avatar, AvatarProps, sizeToPixels } from './Avatar'

interface EditableAvatarProps extends AvatarProps {
  onAvatarChange: (file: File | '') => void
}

export const EditableAvatar: React.FC<EditableAvatarProps> = ({
  avatarHash,
  username,
  size = '2xl',
  onAvatarChange,
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
      onAvatarChange(file)
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
    onAvatarChange('')
  }

  return (
    <Box position='relative' width={sizeToPixels[size]} height={sizeToPixels[size]}>
      {previewUrl ? (
        <Image src={previewUrl} alt='Avatar' borderRadius='full' boxSize={sizeToPixels[size]} objectFit='cover' />
      ) : (
        <Avatar avatarHash={avatarHash} username={username} size={size} />
      )}
      <>
        <IconButton
          aria-label='Edit avatar'
          icon={<EditIcon />}
          position='absolute'
          bottom='0'
          right='0'
          colorScheme='blue'
          rounded='full'
          size={size === '2xl' ? 'sm' : 'xs'}
          onClick={() => inputRef.current?.click()}
        />
        <IconButton
          aria-label='Delete avatar'
          icon={<DeleteIcon />}
          position='absolute'
          top='0'
          right='0'
          colorScheme='red'
          rounded='full'
          size={size === '2xl' ? 'sm' : 'xs'}
          onClick={handleOnAvatarDelete}
        />
      </>
      <input type='file' ref={inputRef} onChange={handleImageChange} accept='image/*' style={{ display: 'none' }} />
    </Box>
  )
}
