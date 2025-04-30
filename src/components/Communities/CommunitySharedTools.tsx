import React from 'react'
import { Heading } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { icons } from '~theme/icons'
import { ElementNotFound } from '~components/Layout/ElementNotFound'

export const CommunitySharedTools: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Heading size='md' mb={4}>
        {t('communities.shared_tools')}
      </Heading>
      <ElementNotFound
        icon={icons.tools}
        title={t('communities.no_shared_tools')}
        desc={t('communities.shared_tools_coming_soon')}
      />
    </>
  )
}
