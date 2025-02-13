import {Box} from '@chakra-ui/react'
import MarkerClusterGroup from '@changey/react-leaflet-markercluster'
import '@changey/react-leaflet-markercluster/dist/styles.min.css'
import L, {LatLng} from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {useTranslation} from 'react-i18next'
import {IoMdHome} from 'react-icons/io'
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import {EmpriusLocation} from '~components/Layout/types'
import {Tool} from '~components/Tools/types'
import {MAP_DEFAULTS} from '~utils/constants'
import {ToolTooltip} from './ToolTooltip'

// Create a function to generate marker icon with badge
const createMarkerIcon = (count: number) => {
  let markerHtml = `<div class="custom-marker">
         <img src="/assets/markers/marker-icon.png" />
       </div>`
  if (count > 1) {
    markerHtml = `<div class="custom-marker">
         <img src="/assets/markers/marker-icon.png" />
         <div class="marker-badge">${count}</div>
       </div>`
  }

  return L.divIcon({
    html: markerHtml,
    className: 'custom-div-icon',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })
}

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
  tools: Tool[]
  center: EmpriusLocation
}

const DEFAULT_CENTER = new LatLng(41.3851, 2.1734) // Barcelona coordinates as default

export const Map = ({ tools, center }: SearchMapProps) => {
  const latlng = center ? new LatLng(center.latitude / 1000000, center.longitude / 1000000) : DEFAULT_CENTER
  const { t } = useTranslation()

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
        center={latlng || MAP_DEFAULTS.CENTER}
        zoom={MAP_DEFAULTS.ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        minZoom={MAP_DEFAULTS.MIN_ZOOM}
        maxZoom={MAP_DEFAULTS.MAX_ZOOM}
      >
        <TileLayer attribution={MAP_DEFAULTS.TILE_LAYER.ATTRIBUTION} url={MAP_DEFAULTS.TILE_LAYER.URL} />
        <Marker position={latlng} icon={HomeIcon}>
          <Popup>{t('map.you_are_here', { defaultValue: 'You are here' })}</Popup>
        </Marker>
        <MarkerClusterGroup chunkedLoading showCoverageOnHover={false} maxClusterRadius={50} spiderfyOnMaxZoom={true}>
          {Object.entries(
            tools.reduce(
              (acc, tool) => {
                if (!tool.location) return acc
                const key = `${tool.location.latitude}-${tool.location.longitude}`
                if (!acc[key]) acc[key] = []
                acc[key].push(tool)
                return acc
              },
              {} as Record<string, Tool[]>
            )
          ).map(([key, groupedTools]) => {
            const [lat, lng] = key.split('-').map(Number)
            return (
              <Marker key={key} position={[lat / 1e6, lng / 1e6]} icon={createMarkerIcon(groupedTools.length)}>
                <Popup>
                  <ToolTooltip tools={groupedTools} />
                </Popup>
              </Marker>
            )
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </Box>
  )
}
