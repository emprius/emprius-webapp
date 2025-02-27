export const ACCEPTED_IMG_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const INPUT_ACCEPTED_IMAGE_TYPES = ACCEPTED_IMG_TYPES.join(', ')

export const filterBySupportedTypes = (files: FileList) =>
  Array.from(files).filter((file) => {
    const isValid = ACCEPTED_IMG_TYPES.includes(file.type)
    if (!isValid) {
      console.warn(`File "${file.name}" was rejected. Only JPG and PNG formats are allowed.`)
    }
    return isValid
  })
