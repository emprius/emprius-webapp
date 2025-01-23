import { Box } from '@chakra-ui/react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from '~components/Search/SearchBar'
import { SearchMap } from '~components/Search/SearchMap'
import { SearchFilters, useSearchTools } from '~components/Search/searchQueries'
import { useAuth } from '~components/Auth/AuthContext'

const defaultValues: Partial<SearchFilters> = {
  term: '',
  categories: undefined,
  transportOptions: undefined,
  distance: 10,
  maxCost: 0,
  mayBeFree: false,
}

export const SearchPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { mutate, data: toolsResponse } = useSearchTools()
  const methods = useForm<SearchFilters>({
    defaultValues,
  })

  const handleToolSelect = (toolId: string) => {
    navigate(`/tools/${toolId}`)
  }

  const onSubmit = (data: SearchFilters) => {
    mutate(data)
  }

  const tools = toolsResponse?.tools || []

  return (
    <Box position='relative' height='100vh'>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <SearchBar />
        </form>
      </FormProvider>

      <SearchMap tools={tools} onToolSelect={handleToolSelect} center={user.location} />
    </Box>
  )
}
