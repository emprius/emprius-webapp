import { LatLng } from 'leaflet'
import { MapContainer, MapContainerProps, Marker, TileLayer } from 'react-leaflet'
import React from 'react'
import { MAP_DEFAULTS } from '~utils/constants'
import { EmpriusLocation } from '~components/Layout/types'

type MapMarkerProps = {
  showMarker?: boolean
} & EmpriusLocation &
  MapContainerProps

export const MapMarker = ({ latitude, longitude, showMarker = true, ...rest }: MapMarkerProps) => {
  const latlng = new LatLng(latitude / 1000000, longitude / 1000000)
  return (
    <MapContainer
      center={latlng}
      zoom={MAP_DEFAULTS.ZOOM}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      minZoom={MAP_DEFAULTS.MIN_ZOOM}
      maxZoom={MAP_DEFAULTS.MAX_ZOOM}
      {...rest}
    >
      <TileLayer attribution={MAP_DEFAULTS.TILE_LAYER.ATTRIBUTION} url={MAP_DEFAULTS.TILE_LAYER.URL} />
      {showMarker && <Marker position={latlng} icon={MAP_DEFAULTS.MARKER} />}
    </MapContainer>
  )
}
