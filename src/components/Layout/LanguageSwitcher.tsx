import React from 'react'
import { Button, Menu, MenuButton, MenuItem, MenuList, useColorModeValue } from '@chakra-ui/react'
import { FiGlobe } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { LanguagesSlice } from '~i18n/languages.mjs'

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const menuBg = useColorModeValue('white', 'gray.800')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')
  const languages = LanguagesSlice as { [key: string]: string }

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    localStorage.setItem('language', languageCode)
  }

  return (
    <Menu>
      <MenuButton as={Button} variant='ghost' leftIcon={<FiGlobe />} size='sm'>
        {languages[i18n.language] || 'English'}
      </MenuButton>
      <MenuList bg={menuBg}>
        {Object.entries(languages).map(([code, name]) => (
          <MenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            bg={code === i18n.language ? hoverBg : 'transparent'}
            _hover={{ bg: hoverBg }}
          >
            {name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
