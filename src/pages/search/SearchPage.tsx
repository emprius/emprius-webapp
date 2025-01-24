import { Box } from '@chakra-ui/react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from '~components/Search/SearchBar'
import { SearchMap } from '~components/Search/SearchMap'
import { SearchFilters, useSearchTools } from '~components/Search/searchQueries'
import { useAuth } from '~components/Auth/AuthContext'

export const MAX_COST_MAX = 1000
export const MAX_COST_DEFAULT = MAX_COST_MAX
export const DISTANCE_MAX = 250
export const DISTANCE_DEFAULT = 50

const defaultValues: Partial<SearchFilters> = {
  term: '',
  categories: undefined,
  transportOptions: undefined,
  distance: DISTANCE_DEFAULT,
  maxCost: MAX_COST_DEFAULT,
  mayBeFree: false,
}

export const SearchPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { mutate, data: toolsResponse } = useSearchTools()
  const methods = useForm<SearchFilters>({
    defaultValues,
  })

  const onSubmit = (data: SearchFilters) => {
    // Avoid sending term if is empty
    if (!data.term) {
      delete data.term
    }
    mutate({
      mayBeFree: data.mayBeFree,
      maxCost: data.maxCost,
      term: data.term,
      // todo(konv1): fix this when fixed on the backend
      // distance: data.distance,
      categories: data.categories,
      transportOptions: data.transportOptions,
    })
  }

  const tools = toolsResponse?.tools || []

  return (
    <Box position='relative' height='100vh'>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <SearchBar />
        </form>
      </FormProvider>

      <SearchMap tools={tools} center={user.location} />
    </Box>
  )
}
