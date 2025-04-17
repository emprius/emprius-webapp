import L, { LatLng, LatLngExpression } from 'leaflet'
import { Circle, MapContainer, MapContainerProps, Marker, TileLayer } from 'react-leaflet'
import React, { PropsWithChildren, useMemo } from 'react'
import { MAP_DEFAULTS } from '~utils/constants'
import { colors } from '~theme/colors'

type EmpriusMarkerProps = {
  position: LatLngExpression
  count?: number
  showExactLocation?: boolean
  // markerProps?: Omit<React.ComponentProps<typeof Marker>, 'position'>
} & PropsWithChildren

type MapMarkerProps = {
  showMarker?: boolean
  markerProps?: Omit<EmpriusMarkerProps, 'position'>
  latLng: LatLng
} & MapContainerProps

export const MapWithMarker = ({ latLng, showMarker = true, markerProps, ...rest }: MapMarkerProps) => {
  return (
    <MapContainer
      center={latLng}
      zoom={MAP_DEFAULTS.ZOOM}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      minZoom={MAP_DEFAULTS.MIN_ZOOM}
      maxZoom={MAP_DEFAULTS.MAX_ZOOM}
      {...rest}
    >
      <TileLayer attribution={MAP_DEFAULTS.TILE_LAYER.ATTRIBUTION} url={MAP_DEFAULTS.TILE_LAYER.URL} />
      {showMarker && <EmpriusMarker position={latLng} {...markerProps} />}
    </MapContainer>
  )
}

export const EmpriusMarker = ({ position, count, showExactLocation = true, children }: EmpriusMarkerProps) => {
  // Create a function to generate marker icon with badge
  const icon = useMemo(() => {
    let markerHtml = `<div class="custom-marker">
       </div>`
    if (count > 1) {
      markerHtml = `<div><div class="custom-marker">
       </div>
         <div class="marker-badge">${count}</div></div>`
    }
    return L.divIcon({
      html: markerHtml,
      className: 'custom-div-icon',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    })
  }, [])

  return (
    <>
      <Marker position={position} icon={icon}>
        {children}
      </Marker>
      {!showExactLocation && <EmpriusCircle center={position} />}
    </>
  )
}

export const EmpriusCircle = ({ center }: { center: LatLngExpression }) => (
  <Circle
    center={center}
    radius={1000}
    pathOptions={{
      fillColor: colors.secondary['300'],
      color: colors.secondary['400'],
      fillOpacity: 0.5,
      weight: 1,
    }}
  />
)
