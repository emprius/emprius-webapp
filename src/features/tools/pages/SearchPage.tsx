import { Box } from '@chakra-ui/react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { SearchMap } from '../components/SearchMap'
import { SearchFilters, useSearchTools } from '../searchQueries'

const defaultValues: Partial<SearchFilters> = {
  term: '',
  distance: 10,
  maxCost: 0,
  mayBeFree: false,
}

export const SearchPage = () => {
  const navigate = useNavigate()
  const { mutate, data: toolsResponse } = useSearchTools()
  const methods = useForm<SearchFilters>({
    defaultValues,
  })

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    methods.setValue('latitude', location.lat)
    methods.setValue('longitude', location.lng)
    mutate(methods.getValues())
  }

  const handleToolSelect = (toolId: string) => {
    navigate(`/tools/${toolId}`)
  }

  const onSubmit = (data: SearchFilters) => {
    mutate(data)
  }

  const tools = toolsResponse?.tools || []
  const { latitude, longitude } = methods.watch()

  return (
    <Box position='relative' height='100vh'>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <SearchBar />
        </form>
      </FormProvider>

      <SearchMap
        tools={tools}
        onLocationSelect={handleLocationSelect}
        onToolSelect={handleToolSelect}
        center={latitude && longitude ? { lat: latitude, lng: longitude } : undefined}
      />
    </Box>
  )
}
