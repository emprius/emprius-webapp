import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom'

export type PaginationContextProps = {
  page: number
  setPage: (page: number) => void
}

export type RoutedPaginationContextProps = Omit<PaginationContextProps, 'setPage'> & {
  path: string
  // Util function that generates the path for a given page
  // (it return the actual path with queryParams and other route params but changing the page)
  getPathForPage: (page: number, queryParams?: string) => string
  setPage: (page: number, queryParams?: string) => void
}

const PaginationContext = createContext<PaginationContextProps | undefined>(undefined)
const RoutedPaginationContext = createContext<RoutedPaginationContextProps | undefined>(undefined)

export const usePagination = (): PaginationContextProps => {
  const context = useContext(PaginationContext)
  if (!context) {
    throw new Error('usePagination must be used within a PaginationProvider')
  }
  return context
}

export const useRoutedPagination = (): RoutedPaginationContextProps => {
  const context = useContext(RoutedPaginationContext)
  if (!context) {
    throw new Error('useRoutedPagination must be used within a RoutedPaginationProvider')
  }
  return context
}

export type PaginationProviderProps = {}

export type RoutedPaginationProviderProps = PaginationProviderProps & {
  path: string
}

export const RoutedPaginationProvider = ({ path, ...rest }: PropsWithChildren<{ path: string }>) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Read current query params
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const pageParam = searchParams.get('page')
  const page = pageParam && !isNaN(Number(pageParam)) && Number(pageParam) > 0 ? Number(pageParam) - 1 : 0

  // Generate URL with updated page query param
  const getPathForPage = (page: number, queryParams?: string) => {
    const params = new URLSearchParams(queryParams || location.search)
    if (page > 0) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }

    return `${path}?${params.toString()}`
  }

  const setPage = (page: number, queryParams?: string) => {
    navigate(getPathForPage(page, queryParams))
  }

  return <RoutedPaginationContext.Provider value={{ page, path, getPathForPage, setPage }} {...rest} />
}

export const PaginationProvider = ({ ...rest }: PropsWithChildren<PaginationProviderProps>) => {
  const [page, setPage] = useState<number>(0)

  return <PaginationContext.Provider value={{ page, setPage }} {...rest} />
}
