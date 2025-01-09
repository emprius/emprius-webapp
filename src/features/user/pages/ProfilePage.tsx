import { Container, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { UserBookings } from '~src/features/user/components/UserBookings'
import { UserTools } from '~src/features/user/components/UserTools'
import { UserInfo } from '../components/UserInfo'

export const ProfilePage = () => {
  const { t } = useTranslation()
  const tabBg = useColorModeValue('white', 'gray.800')

  return (
    <Container maxW='container.xl' py={8}>
      <Stack spacing={8}>
        <UserInfo />
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
