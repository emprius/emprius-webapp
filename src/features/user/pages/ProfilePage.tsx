import React from 'react'
import { Container, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { UserInfo } from '../components/UserInfo'

export const ProfilePage = () => {
  const { t } = useTranslation()
  const tabBg = useColorModeValue('white', 'gray.800')

  return (
    <Container maxW='container.xl' py={8}>
      <Stack spacing={8}>
        <UserInfo />

        <Tabs variant='enclosed' bg={tabBg} borderRadius='lg' boxShadow='sm'>
          <TabList>
            <Tab>{t('user.myTools')}</Tab>
            <Tab>{t('user.myBookings')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              todo
              {/*<UserTools />*/}
            </TabPanel>
            <TabPanel>
              todo
              {/*<UserBookings />*/}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  )
}
