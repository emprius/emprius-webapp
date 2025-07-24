import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import L, { LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { MAP_DEFAULTS } from '~utils/constants'
import { EmpriusMarker, EmpriusMarkerProps } from '~components/Layout/Map/Map'
import { FormHelperText } from '@chakra-ui/icons'

L.Marker.prototype.options.icon = MAP_DEFAULTS.MARKER

interface LocationPickerProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  isRequired?: boolean
  rules?: Record<string, any>
  helperText?: string
  canEdit?: boolean
  markerProps?: Omit<EmpriusMarkerProps, 'position'>
}

// Component to handle map clicks and movement
const MapController = ({
  onLocationSelect,
  position,
}: {
  onLocationSelect: (latLng: LatLng) => void
  position: LatLng | null
}) => {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), {
        duration: 1.5,
      })
    }
  }, [position, map])

  useEffect(() => {
    map.on('click', (e) => {
      onLocationSelect(e.latlng)
    })
    return () => {
      map.off('click')
    }
  }, [map, onLocationSelect])

  return null
}

export const LocationPicker = <T extends FieldValues>({
  name,
  control,
  isRequired = false,
  rules,
  helperText,
  canEdit = true,
  markerProps,
}: LocationPickerProps<T>) => {
  const { t } = useTranslation()

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: isRequired && t('common.required'),
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleLocationSelect = (latLng: LatLng) => {
          if (!canEdit) return
          onChange(latLng)
        }

        return (
          <FormControl isRequired={isRequired} isInvalid={!!error}>
            <FormLabel>{t('common.location')}</FormLabel>
            {helperText && <FormHelperText mb={4}>{helperText}</FormHelperText>}
            <div className='map-container'>
              <MapContainer
                center={value || MAP_DEFAULTS.CENTER}
                zoom={MAP_DEFAULTS.ZOOM}
                scrollWheelZoom={true}
                minZoom={MAP_DEFAULTS.MIN_ZOOM}
                maxZoom={MAP_DEFAULTS.MAX_ZOOM}
              >
                <TileLayer attribution={MAP_DEFAULTS.TILE_LAYER.ATTRIBUTION} url={MAP_DEFAULTS.TILE_LAYER.URL} />
                <MapController onLocationSelect={handleLocationSelect} position={value} />
                {value && <EmpriusMarker position={value} {...markerProps} />}
              </MapContainer>
            </div>
            <FormErrorMessage>{error?.message}</FormErrorMessage>
          </FormControl>
        )
      }}
    />
  )
}
