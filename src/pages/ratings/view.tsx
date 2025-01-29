import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RatingsList } from '~components/Ratings/RatingsList'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { useOutletContext } from 'react-router-dom'

export const View = () => {
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()

  useEffect(() => {
    setTitle(t('rating.pending_ratings'))
  }, [setTitle])

  return <RatingsList />
}
