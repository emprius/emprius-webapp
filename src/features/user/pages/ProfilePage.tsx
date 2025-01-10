import {
  Box,
  Button,
  Container,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { EditIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'
import { UserBookings } from '~src/features/user/components/UserBookings'
import { UserTools } from '~src/features/user/components/UserTools'
import { UserInfo } from '../components/UserInfo'
import { EditProfileForm } from '../components/EditProfileForm'
import { useAuth } from '~src/features/auth/context/AuthContext'

export const ProfilePage = () => {
  const { t } = useTranslation()
  const tabBg = useColorModeValue('white', 'gray.800')
  const { isOpen, onToggle } = useDisclosure()
  const { user } = useAuth()

  return (
    <Container maxW='container.xl' py={8}>
      <Stack spacing={8}>
        <Box position='relative'>
          {isOpen ? (
            <EditProfileForm
              initialData={{
                name: user?.name || '',
                email: user?.email || '',
                location: user?.location,
                active: user?.active || false,
                avatarHash: user?.avatarHash,
              }}
              onSuccess={onToggle}
            />
          ) : (
            <>
              <UserInfo />
              <Button
                leftIcon={<EditIcon />}
                colorScheme='blue'
                variant='outline'
                onClick={onToggle}
                position='absolute'
                top='0'
                right='0'
              >
                {t('common.edit')}
              </Button>
            </>
          )}
        </Box>
        <Tabs variant='enclosed' bg={tabBg} borderRadius='lg' boxShadow='sm' isLazy>
          <TabList>
            <Tab>{t('user.myTools')}</Tab>
            <Tab>{t('user.myBookings')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <UserTools />
            </TabPanel>
            <TabPanel>
              <UserBookings />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  )
}
