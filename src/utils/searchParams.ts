import { SearchFilters, DISTANCE_DEFAULT, MAX_COST_DEFAULT } from '~components/Search/SearchContext'
import { SearchParams } from '~components/Search/queries'

/**
 * Serialize search filters to URL search parameters
 */
export const serializeFiltersToURL = (filters: SearchParams): URLSearchParams => {
  const params = new URLSearchParams()

  if (filters.term) {
    params.set('term', filters.term)
  } else {
    params.delete('term')
  }

  if (filters.categories?.length) {
    params.set('categories', filters.categories.join(','))
  }

  if (filters.transportOptions?.length) {
    params.set('transportOptions', filters.transportOptions.join(','))
  }

  if (filters.distance !== undefined && filters.distance !== DISTANCE_DEFAULT) {
    params.set('distance', filters.distance.toString())
  }

  if (filters.maxCost !== undefined && filters.maxCost !== MAX_COST_DEFAULT) {
    params.set('maxCost', filters.maxCost.toString())
  }

  if (filters.mayBeFree === true) {
    params.set('mayBeFree', 'true')
  }

  if (filters.page && filters.page >= 0) {
    params.set('page', filters.page.toString())
  }

  return params
}

/**
 * Deserialize URL search parameters to search filters
 */
export const deserializeFiltersFromURL = (searchParams: URLSearchParams): Partial<SearchParams> => {
  const filters: Partial<SearchParams> = {}

  const term = searchParams.get('term')
  if (term) {
    filters.term = term
  }

  const categories = searchParams.get('categories')
  if (categories) {
    const categoryIds = categories
      .split(',')
      .map(Number)
      .filter((id) => !isNaN(id))
    if (categoryIds.length > 0) {
      filters.categories = categoryIds
    }
  }

  const transportOptions = searchParams.get('transportOptions')
  if (transportOptions) {
    const transportIds = transportOptions
      .split(',')
      .map(Number)
      .filter((id) => !isNaN(id))
    if (transportIds.length > 0) {
      filters.transportOptions = transportIds
    }
  }

  const distance = searchParams.get('distance')
  if (distance) {
    const distanceValue = parseInt(distance)
    if (!isNaN(distanceValue) && distanceValue > 0) {
      filters.distance = distanceValue
    }
  }

  const maxCost = searchParams.get('maxCost')
  if (maxCost) {
    const maxCostValue = parseInt(maxCost)
    if (!isNaN(maxCostValue) && maxCostValue >= 0) {
      filters.maxCost = maxCostValue
    }
  }

  const mayBeFree = searchParams.get('mayBeFree')
  if (mayBeFree === 'true') {
    filters.mayBeFree = true
  }

  const page = searchParams.get('page')
  if (page) {
    const pageValue = parseInt(page)
    if (!isNaN(pageValue) && pageValue > 0) {
      filters.page = pageValue
    }
  }

  return filters
}

/**
 * Check if URL search parameters contain any search filters
 */
export const hasSearchFiltersInURL = (searchParams: URLSearchParams): boolean => {
  const filterKeys = ['categories', 'transportOptions', 'distance', 'maxCost', 'mayBeFree', 'page', 'term']
  return filterKeys.some((key) => searchParams.has(key))
}
