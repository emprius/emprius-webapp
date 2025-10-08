import { Button, ButtonProps } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

type LoadMoreButtonProps = {
  fetchNextPage: () => void
  isFetchingNextPage: boolean
} & ButtonProps

const LoadMoreButton = ({ fetchNextPage, isFetchingNextPage, ...props }: LoadMoreButtonProps) => {
  const { t } = useTranslation()

  return (
    <Button
      onClick={fetchNextPage}
      isLoading={isFetchingNextPage}
      loadingText={t('common.loading_more', { defaultValue: 'Loading more...' })}
      variant='ghost'
      size='sm'
      {...props}
    >
      {t('common.load_more_conversations', { defaultValue: 'Load More' })}
    </Button>
  )
}

export default LoadMoreButton
