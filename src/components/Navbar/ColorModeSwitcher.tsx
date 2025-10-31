import { FiMoon, FiSun } from 'react-icons/fi'
import { IconButton, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ColorModeSwitcher = () => {
  const { t } = useTranslation()
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <IconButton
      aria-label={t('common.toggle_theme')}
      icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
      onClick={toggleColorMode}
      variant='ghost'
    />
  )
}

export default ColorModeSwitcher
