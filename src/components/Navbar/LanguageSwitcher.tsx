import React from 'react'
import { Button, ButtonProps, Menu, MenuButton, MenuItem, MenuList, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { LanguagesSlice } from '~i18n/languages.mjs'
import { icons } from '~theme/icons'
import { useUpdateUserProfile } from '~components/Users/queries'
import { useAuth } from '~components/Auth/AuthContext'

export const LanguageSwitcher = ({ iconOnly = false, ...rest }: { iconOnly?: boolean } & ButtonProps) => {
  const { i18n } = useTranslation()
  const { isAuthenticated } = useAuth()
  const menuBg = useColorModeValue('white', 'gray.800')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')
  const languages = LanguagesSlice as { [key: string]: string }
  const { mutate } = useUpdateUserProfile()

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    if (isAuthenticated) {
      mutate({ lang: languageCode })
    }
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant='ghost'
        leftIcon={icons.globe({})}
        size='sm'
        iconSpacing={iconOnly ? '0' : '0.5rem'}
        {...rest}
      >
        {!iconOnly && languages[i18n.language]}
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
