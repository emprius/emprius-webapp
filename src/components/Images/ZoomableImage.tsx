import { Box, Image, ImageProps } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

interface TouchPoint {
  x: number
  y: number
}

interface ZoomableImageProps extends Omit<ImageProps, 'onTouchStart' | 'onTouchMove' | 'onTouchEnd'> {
  src: string
  alt?: string
  enableMagnifier?: boolean
  magnification?: number
  magnifierSize?: number
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  enableMagnifier = true,
  magnification = 2.5,
  magnifierSize = 200,
  ...imageProps
}) => {
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [lastDistance, setLastDistance] = useState<number | null>(null)
  const [lastTouchPoint, setLastTouchPoint] = useState<TouchPoint | null>(null)
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 })
  const [imagePos, setImagePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Calculate distance between two touch points
  const getDistance = (touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Get the center point between two touches
  const getCenter = (touch1: Touch, touch2: Touch): TouchPoint => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Two finger pinch - initialize zoom
      const distance = getDistance(e.touches[0], e.touches[1])
      setLastDistance(distance)
    } else if (e.touches.length === 1 && scale > 1) {
      // Single finger pan (only when zoomed in)
      setLastTouchPoint({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent default scrolling

    if (e.touches.length === 2 && lastDistance !== null) {
      // Two finger pinch - zoom
      const distance = getDistance(e.touches[0], e.touches[1])
      const scaleChange = distance / lastDistance

      // Calculate new scale with limits (0.5x to 5x)
      const newScale = Math.max(0.5, Math.min(5, scale * scaleChange))

      setScale(newScale)
      setLastDistance(distance)

      // If zooming out to 1 or less, reset translation
      if (newScale <= 1) {
        setTranslate({ x: 0, y: 0 })
      }
    } else if (e.touches.length === 1 && lastTouchPoint !== null && scale > 1) {
      // Single finger pan (only when zoomed in)
      const touch = e.touches[0]
      const dx = touch.clientX - lastTouchPoint.x
      const dy = touch.clientY - lastTouchPoint.y

      // Update translation
      setTranslate((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }))

      setLastTouchPoint({
        x: touch.clientX,
        y: touch.clientY,
      })
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      setLastDistance(null)
    }
    if (e.touches.length < 1) {
      setLastTouchPoint(null)
    }

    // If zoomed out to normal or less, reset everything
    if (scale <= 1) {
      setScale(1)
      setTranslate({ x: 0, y: 0 })
    }
  }

  // Magnifier handlers for desktop
  const handleMouseEnter = () => {
    if (enableMagnifier && window.matchMedia('(hover: hover)').matches) {
      setShowMagnifier(true)
    }
  }

  const handleMouseLeave = () => {
    setShowMagnifier(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableMagnifier || !imageRef.current || !containerRef.current) return

    const container = containerRef.current
    const image = imageRef.current
    const rect = container.getBoundingClientRect()
    const imgRect = image.getBoundingClientRect()

    // Calculate mouse position relative to the actual image (not container)
    const x = e.clientX - imgRect.left
    const y = e.clientY - imgRect.top

    // Calculate position for magnifier popup (offset from cursor)
    const offsetX = 10
    const offsetY = 10
    let magX = e.clientX + offsetX
    let magY = e.clientY + offsetY

    // Keep magnifier within viewport
    if (magX + magnifierSize > window.innerWidth) {
      magX = e.clientX - magnifierSize - offsetX
    }
    if (magY + magnifierSize > window.innerHeight) {
      magY = e.clientY - magnifierSize - offsetY
    }

    setMagnifierPos({ x: magX, y: magY })

    // Calculate the background position for the magnifier
    // The background should be positioned so the point under the cursor appears centered in magnifier
    const bgPosX = -x * magnification + magnifierSize / 2
    const bgPosY = -y * magnification + magnifierSize / 2

    setImagePos({ x: bgPosX, y: bgPosY })
  }

  return (
    <>
      <Box
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        sx={{
          touchAction: 'none',
          overflow: scale > 1 ? 'visible' : 'hidden',
          cursor: scale > 1 ? 'grab' : showMagnifier ? 'crosshair' : 'default',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          position: 'relative',
          transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
          transformOrigin: 'center center',
          transition: 'transform 0.05s ease-out',
        }}
      >
        <Image
          ref={imageRef}
          src={src}
          sx={{
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            display: 'block',
          }}
          {...imageProps}
        />
      </Box>

      {/* Magnifier Loupe - Desktop Only */}
      {showMagnifier && enableMagnifier && imageRef.current && (
        <Box
          position='fixed'
          left={`${magnifierPos.x}px`}
          top={`${magnifierPos.y}px`}
          width={`${magnifierSize}px`}
          height={`${magnifierSize}px`}
          border='3px solid white'
          // borderRadius='50%'
          boxShadow='0 4px 12px rgba(0, 0, 0, 0.3), inset 0 0 8px rgba(0, 0, 0, 0.1)'
          overflow='hidden'
          pointerEvents='none'
          zIndex={9999}
          bg='white'
        >
          <Box
            width='100%'
            height='100%'
            backgroundImage={`url(${src})`}
            backgroundRepeat='no-repeat'
            backgroundSize={`${imageRef.current.width * magnification}px ${imageRef.current.height * magnification}px`}
            backgroundPosition={`${imagePos.x}px ${imagePos.y}px`}
            sx={{
              imageRendering: 'auto',
            }}
          />
        </Box>
      )}
    </>
  )
}
