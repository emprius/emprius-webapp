/**
 * Format a number as currency in EUR
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ca-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a date string to localized format
 */
export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('ca-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Calculate distance between two points in kilometers
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Convert degrees to radians
 */
const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180
}

/**
 * Debounce a function
 */
export const debounce = <Args extends unknown[]>(
  func: (...args: Args) => unknown,
  wait: number
): ((...args: Args) => void) => {
  let timeout: NodeJS.Timeout

  return (...args: Args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Get file extension from file name
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

/**
 * Check if file type is image
 */
export const isImageFile = (file: File): boolean => {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return acceptedTypes.includes(file.type)
}

/**
 * Format file size to human readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const getB64FromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result?.toString().split(',')[1]
      if (base64) resolve(base64)
      else reject('Failed to convert image to base64')
    }
    reader.onerror = () => reject('Failed to read file')
    reader.readAsDataURL(file)
  })
}
