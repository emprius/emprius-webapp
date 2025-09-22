import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'
import { ConversationsList } from '~components/Messages/ConversationsList'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'

export const View = () => {
  const { t } = useTranslation()
  const { setData } = useOutletContext<TitlePageLayoutContext>()

  useEffect(() => {
    setData(t('messages.conversations', { defaultValue: 'Messages' }))
  }, [setData, t])

  return <ConversationsList />
}
