import { ReactElement, useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { EllipsisButton } from './EllipsisButton'
import { Button, ButtonGroup, ButtonGroupProps, ButtonProps, InputProps, Text } from '@chakra-ui/react'
import { PaginationInfo } from '~src/services/api'
import { usePagination, useRoutedPagination } from '~components/Layout/Pagination/PaginationProvider'
import { useTranslation } from 'react-i18next'

export type PaginationApiParams = { page?: number }

export type PaginationProps = ButtonGroupProps & {
  maxButtons?: number | false
  buttonProps?: ButtonProps
  inputProps?: InputProps
} & PaginationInfo

type PaginatorButtonProps = {
  page: number
  currentPage: number
} & ButtonProps

const PageButton = ({ page, currentPage, ...rest }: PaginatorButtonProps) => (
  <Button isActive={currentPage === page} {...rest}>
    {page + 1}
  </Button>
)

const RoutedPageButton = ({ page, currentPage, to, ...rest }: PaginatorButtonProps & { to: string }) => (
  <Button variant={'outline'} as={RouterLink} to={to} isActive={currentPage === page} {...rest}>
    {page + 1}
  </Button>
)

type CreatePageButtonType = (i: number) => ReactElement
type GotoPageType = (page: number) => void

const usePaginationPages = (
  currentPage: number,
  totalPages: number | undefined,
  maxButtons: number | undefined | false,
  gotoPage: GotoPageType,
  createPageButton: CreatePageButtonType,
  inputProps?: InputProps,
  buttonProps?: ButtonProps
) =>
  useMemo(() => {
    if (totalPages === undefined) return []

    let pages: ReactElement[] = []

    // Create an array of all page buttons
    for (let i = 0; i < totalPages; i++) {
      pages.push(createPageButton(i))
    }

    if (!maxButtons || totalPages <= maxButtons) {
      return pages
    }

    const startEllipsis = (
      <EllipsisButton key='start-ellipsis' gotoPage={gotoPage} inputProps={inputProps} {...buttonProps} />
    )
    const endEllipsis = (
      <EllipsisButton key='end-ellipsis' gotoPage={gotoPage} inputProps={inputProps} {...buttonProps} />
    )

    // Add ellipsis and slice the array accordingly
    const sideButtons = 2 // First and last page
    const availableButtons = maxButtons - sideButtons // Buttons we can distribute around the current page

    if (currentPage <= availableButtons / 2) {
      // Near the start
      return [...pages.slice(0, availableButtons), endEllipsis, pages[totalPages - 1]]
    } else if (currentPage >= totalPages - 1 - availableButtons / 2) {
      // Near the end
      return [pages[0], startEllipsis, ...pages.slice(totalPages - availableButtons, totalPages)]
    } else {
      // In the middle
      const startPage = currentPage - Math.floor((availableButtons - 1) / 2)
      const endPage = currentPage + Math.floor(availableButtons / 2)
      return [pages[0], startEllipsis, ...pages.slice(startPage, endPage - 1), endEllipsis, pages[totalPages - 1]]
    }
  }, [totalPages, maxButtons, gotoPage, inputProps, buttonProps, currentPage, createPageButton])

const PaginationButtons = ({
  totalPages,
  totalItems,
  currentPage,
  goToPage,
  createPageButton,
  maxButtons = 7,
  buttonProps,
  ...rest
}: {
  totalPages: number | undefined
  totalItems: number | undefined
  currentPage: number
  createPageButton: CreatePageButtonType
  goToPage: GotoPageType
} & ButtonGroupProps &
  Pick<PaginationProps, 'maxButtons' | 'buttonProps'>) => {
  const { t } = useTranslation()

  const pages = usePaginationPages(
    currentPage,
    totalPages,
    maxButtons ? Math.max(5, maxButtons) : false,
    (page) => {
      if (page >= 0 && totalPages && page < totalPages) {
        goToPage(page)
      }
    },
    createPageButton
  )

  return (
    <>
      <ButtonGroup {...rest}>
        {totalPages === undefined ? (
          <>
            <Button
              key='previous'
              onClick={() => goToPage(currentPage - 1)}
              isDisabled={currentPage === 0}
              {...buttonProps}
            >
              Previous
            </Button>
            <Button key='next' onClick={() => goToPage(currentPage + 1)} {...buttonProps}>
              Next
            </Button>
          </>
        ) : (
          pages
        )}
      </ButtonGroup>
      {totalItems && (
        <Text mt={2}>
          {t('pagination.total_results', {
            count: totalItems,
            defaultValue: 'Total {{count}}',
          })}
        </Text>
      )}
    </>
  )
}

export const Pagination = ({ maxButtons = 8, buttonProps, inputProps, pagination, ...rest }: PaginationProps) => {
  const { setPage } = usePagination()

  if (!pagination || pagination.pages < 2) return null

  const totalPages = pagination?.pages
  const page = pagination?.current

  return (
    <PaginationButtons
      goToPage={(page) => setPage(page)}
      createPageButton={(i) => (
        <PageButton key={i} page={i} currentPage={page} onClick={() => setPage(i)} {...buttonProps} />
      )}
      currentPage={page}
      totalPages={totalPages}
      totalItems={pagination.total}
      maxButtons={maxButtons}
      {...rest}
    />
  )
}

export const RoutedPagination = ({ maxButtons = 8, buttonProps, pagination, ...rest }: PaginationProps) => {
  const { getPathForPage, setPage, page } = useRoutedPagination()

  if (!pagination || pagination.pages < 2) return null

  const totalPages = pagination.pages

  return (
    <PaginationButtons
      goToPage={(page) => setPage(page)}
      createPageButton={(i) => (
        <RoutedPageButton key={i} to={getPathForPage(i)} page={i} currentPage={page} {...buttonProps} />
      )}
      currentPage={page}
      totalPages={totalPages}
      totalItems={pagination.total}
      {...rest}
    />
  )
}
