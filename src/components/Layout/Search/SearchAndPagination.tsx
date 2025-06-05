import { PropsWithChildren, useEffect } from 'react'
import { RoutedPaginationProvider, useRoutedPagination } from '~components/Layout/Pagination/PaginationProvider'
import { DebouncedSearchProvider, useDebouncedSearch } from '~components/Layout/Search/DebouncedSearchContext'
import { SearchApiParams } from '~components/Layout/Search/SearchBar'
import { PaginationApiParams } from '~components/Layout/Pagination/Pagination'

/**
 * This component combines search and pagination functionality.
 * It provides a context for debounced search and routed pagination,
 * and resets the page to 0 whenever the search term changes.
 * @param children
 * @constructor
 */
export const SearchAndPagination = ({ children }: PropsWithChildren) => {
  return (
    <RoutedPaginationProvider>
      <DebouncedSearchProvider>
        <ResetPageOnSearch>{children}</ResetPageOnSearch>
      </DebouncedSearchProvider>
    </RoutedPaginationProvider>
  )
}

const ResetPageOnSearch = ({ children }: PropsWithChildren) => {
  const { debouncedSearch: term, prevTermRef } = useDebouncedSearch()
  const { page, setPage } = useRoutedPagination()

  // Reset page to 0 only when search term changes from previous value
  useEffect(() => {
    // Only reset page if term has changed from previous value and setPage is available
    if (term !== prevTermRef.current) {
      setPage(0)
    }
    // Update the previous term reference
    prevTermRef.current = term
  }, [term, prevTermRef, page])

  return <>{children}</>
}
export type SearchAndPaginationApiParams = SearchApiParams & PaginationApiParams
