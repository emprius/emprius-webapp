import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useSearchTools, SearchFilters } from '../searchQueries'
import { SearchBar } from '../components/SearchBar'
import { SearchMap } from '../components/SearchMap'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'

export const SearchPage = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Partial<SearchFilters>>({})
  const { data: toolsResponse, isLoading } = useSearchTools(filters)

  const handleSearch = (term: string) => {
    setFilters((prev) => ({
      ...prev,
      term,
    }))
  }

  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setFilters((prev) => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
    }))
  }

  const handleToolSelect = (toolId: string) => {
    navigate(`/tools/${toolId}`)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  const tools = toolsResponse?.tools || []

  return (
    <Box position="relative" height="100vh">
      <SearchBar
        onSearch={handleSearch}
        onFiltersChange={handleFiltersChange}
        filters={filters}
      />
      
      <SearchMap
        tools={tools}
        onLocationSelect={handleLocationSelect}
        onToolSelect={handleToolSelect}
        center={
          filters.latitude && filters.longitude
            ? { lat: filters.latitude, lng: filters.longitude }
            : undefined
        }
      />
    </Box>
  )
}
