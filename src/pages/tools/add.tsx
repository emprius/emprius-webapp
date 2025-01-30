import React, { useEffect } from 'react'
import { AddTool } from '~components/Tools/Add'
import { useOutletContext } from 'react-router-dom'
import { FormLayoutContext } from '~src/pages/FormLayout'
import { useTranslation } from 'react-i18next'

export const Add = () => {
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<FormLayoutContext>()

  useEffect(() => {
    setTitle(t('tools.add_tool'))
  }, [setTitle])

  return <AddTool />
}
