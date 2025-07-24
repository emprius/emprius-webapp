import { Box, Text, VStack } from '@chakra-ui/react'
import MarkerClusterGroup from '@changey/react-leaflet-markercluster'
import '@changey/react-leaflet-markercluster/dist/styles.min.css'
import L, { latLng, LatLng, LatLngExpression } from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'
import React, { useMemo } from 'react'
import { useAuth } from '~components/Auth/AuthContext'
import ReactDOMServer from 'react-dom/server'
import { useTranslation } from 'react-i18next'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import { Tool, ToolDetail } from '~components/Tools/types'
import { MAP_DEFAULTS } from '~utils/constants'
import { ToolTooltip } from './ToolTooltip'
import { Avatar } from '~components/Images/Avatar'
import { EmpriusCircle, EmpriusMarker } from '~components/Layout/Map/Map'
import { icons } from '~theme/icons'

const HomeIcon = L.divIcon({
  className: 'custom-home-marker',
  html: ReactDOMServer.renderToString(
    icons.userHome({
      style: { color: '#0967D2', fontSize: '52px', filter: 'drop-shadow(3px 3px 4px #0967D2)' },
    })
  ),
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [1, -35],
})

export interface SearchMapProps {
  tools: ToolDetail[]
  center: LatLng
}

export const Map = ({ tools, center }: SearchMapProps) => {
  const { user } = useAuth()
  const latlngCenter = center ? center : MAP_DEFAULTS.CENTER
  const { t } = useTranslation()

  const groupedTools = useMemo(
    () =>
      tools.reduce(
        (acc, tool) => {
          if (!tool.location) return acc
          const loc = tool.location
          const key = `${loc.lat}-${loc.lng}`
          if (!acc[key]) acc[key] = []
          acc[key].push(tool)
          return acc
        },
        {} as Record<string, Tool[]>
      ),
    [tools]
  )

  return (
    <Box
      h='100%'
      w='full'
      position='relative'
      overflow='hidden'
      sx={{
        '.custom-home-marker': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'none',
          border: 'none',
        },
        '.leaflet-control-zoom': {
          position: 'fixed',
          right: '16px',
          bottom: '25px',
          zIndex: 1000,
        },
      }}
    >
      <MapContainer
        center={latlngCenter}
        zoom={MAP_DEFAULTS.ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        minZoom={MAP_DEFAULTS.MIN_ZOOM}
        maxZoom={MAP_DEFAULTS.MAX_ZOOM}
      >
        <TileLayer attribution={MAP_DEFAULTS.TILE_LAYER.ATTRIBUTION} url={MAP_DEFAULTS.TILE_LAYER.URL} />
        <Marker position={latlngCenter} icon={HomeIcon}>
          <Popup>
            <VStack p={4}>
              <Avatar username={user.name} avatarHash={user.avatarHash} size={'sm'} />
              <Text>{t('map.you_are_here', { defaultValue: 'You are here' })}</Text>
            </VStack>
          </Popup>
        </Marker>
        <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} maxClusterRadius={50} spiderfyOnMaxZoom={true}>
          {Object.entries(groupedTools).map(([key, toolGroup]) => {
            const loc = latLng(key.split('-').map(Number) as LatLngExpression)
            return <RegularAndNomadicMarker key={key} loc={loc} toolGroup={toolGroup} />
          })}
        </MarkerClusterGroup>
        {/*Circle markers must be outside MarkerClusterGroup to do not be grouped with the other marker*/}
        {Object.entries(groupedTools).map(([key, _]) => {
          const loc = key.split('-').map(Number) as LatLngExpression
          return <EmpriusCircle key={`${key}circle`} center={loc} />
        })}
      </MapContainer>
    </Box>
  )
}

const RegularAndNomadicMarker = ({ toolGroup, loc }: { toolGroup: Tool[]; loc: LatLng }) => {
  const [nomadic, regular] = useMemo(
    () =>
      toolGroup.reduce<[Tool[], Tool[]]>(
        ([nomadic, regular], item) => {
          if (item.isNomadic) {
            nomadic.push(item)
          } else {
            regular.push(item)
          }
          return [nomadic, regular]
        },
        [[], []]
      ),
    [toolGroup]
  )

  const getDeltaLngDeg = (latlng: LatLng, km: number) => {
    const earthRadius = 6371 // Earth radius in km
    const deltaLng = km / earthRadius / Math.cos((latlng.lat * Math.PI) / 180)
    return deltaLng * (180 / Math.PI)
  }

  let nomadicLoc = loc
  let regularLoc = loc
  const bothTypes = nomadic.length && regular.length
  if (bothTypes) {
    const deltaLngDeg = getDeltaLngDeg(loc, 0.2)
    const south = 0.0008
    nomadicLoc = L.latLng(loc.lat - south, loc.lng - deltaLngDeg)
    regularLoc = L.latLng(loc.lat - south, loc.lng + deltaLngDeg)
  }

  const key = `${loc.lng}-${loc.lng}`
  return (
    <>
      {nomadic.length && (
        <EmpriusMarker key={`${key}-1`} position={nomadicLoc} count={nomadic.length} isNomadic>
          <Popup>
            <ToolTooltip tools={nomadic} />
          </Popup>
        </EmpriusMarker>
      )}
      {regular.length && (
        <EmpriusMarker key={`${key}-2`} position={regularLoc} count={regular.length}>
          <Popup>
            <ToolTooltip tools={regular} />
          </Popup>
        </EmpriusMarker>
      )}
      {bothTypes && <Polyline positions={[nomadicLoc, loc, regularLoc]} weight={2} color={'#FF8724'} />}
    </>
  )
}
