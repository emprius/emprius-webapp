import { Box, Text, VStack } from '@chakra-ui/react'
import MarkerClusterGroup from '@changey/react-leaflet-markercluster'
import '@changey/react-leaflet-markercluster/dist/styles.min.css'
import L, { LatLng, LatLngExpression } from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'
import React, { useMemo } from 'react'
import { useAuth } from '~components/Auth/AuthContext'
import ReactDOMServer from 'react-dom/server'
import { useTranslation } from 'react-i18next'
import { IoMdHome } from 'react-icons/io'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { EmpriusLocation } from '~components/Layout/Map/types'
import { Tool, ToolLocated } from '~components/Tools/types'
import { MAP_DEFAULTS } from '~utils/constants'
import { ToolTooltip } from './ToolTooltip'
import { Avatar } from '~components/Images/Avatar'
import { EmpriusCircle, EmpriusMarker } from '~components/Layout/Map/Map'

const HomeIcon = L.divIcon({
  className: 'custom-home-marker',
  html: ReactDOMServer.renderToString(
    <IoMdHome style={{ color: '#0967D2', fontSize: '52px', filter: 'drop-shadow(3px 3px 4px #0967D2)' }} />
  ),
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [1, -35],
})

export interface SearchMapProps {
  tools: ToolLocated[]
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
          {Object.entries(groupedTools).map(([key, groupedTools]) => {
            const loc = key.split('-').map(Number) as LatLngExpression
            return (
              <EmpriusMarker key={key} position={loc} count={groupedTools.length}>
                <Popup>
                  <ToolTooltip tools={groupedTools} />
                </Popup>
              </EmpriusMarker>
            )
          })}
        </MarkerClusterGroup>
        {/*Circle markers must be outside MarkerClusterGroup to do not be grouped with the other marker*/}
        {Object.entries(groupedTools).map(([key, groupedTools]) => {
          const isOwner = groupedTools.some((tool) => tool.userId === user?.id)
          if (isOwner) return null
          const loc = key.split('-').map(Number) as LatLngExpression
          return <EmpriusCircle key={`${key}circle`} center={loc} />
        })}
      </MapContainer>
    </Box>
  )
}
