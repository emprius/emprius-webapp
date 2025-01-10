import {
  Box,
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
      <Stack spacing={6}>
        <Box position='relative' bg={tabBg} borderRadius='lg' p={6} boxShadow='sm'>
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
            <UserInfo onEdit={onToggle} />
          )}
        </Box>
        <Tabs variant='enclosed' isLazy>
          <Box bg={tabBg} borderRadius='lg' boxShadow='sm' p={4}>
          <TabList mb={4}>
            <Tab>{t('user.myTools')}</Tab>
            <Tab>{t('user.myBookings')}</Tab>
          </TabList>
          <TabPanels px={2}>
            <TabPanel>
              <UserTools />
            </TabPanel>
            <TabPanel>
              <UserBookings />
            </TabPanel>
          </TabPanels>
          </Box>
        </Tabs>
      </Stack>
    </Container>
  )
}
