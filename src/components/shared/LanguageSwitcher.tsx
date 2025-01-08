import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiGlobe } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ca', name: 'Català' },
  { code: 'es', name: 'Español' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const menuBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
  };

  const getCurrentLanguageName = () => {
    const currentLang = languages.find(lang => lang.code === i18n.language);
    return currentLang ? currentLang.name : 'English';
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        leftIcon={<FiGlobe />}
        size="sm"
      >
        {getCurrentLanguageName()}
      </MenuButton>
      <MenuList bg={menuBg}>
        {languages.map(({ code, name }) => (
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
  );
};
