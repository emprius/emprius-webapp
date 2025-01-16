import {
  Box,
  Container,
  Heading,
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
import { useAuth } from '~components/Auth/AuthContext'
import { UserBookings } from '~components/Bookings/UserBookings'
import { RatingsList } from '~components/Ratings/RatingsList'
import { UserTools } from '~components/Tools/UserTools'
import { EditProfileForm } from '~components/User/EditProfileForm'
import { UserInfo } from '~components/User/UserInfo'

export const Profile = () => {
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
        <Box>
          <Heading size='md' mb={4}>
            {t('rating.reviews')}
          </Heading>
        </Box>
        <Tabs variant='enclosed' isLazy>
          <Box bg={tabBg} borderRadius='lg' boxShadow='sm' p={4}>
            <TabList mb={4}>
              <Tab>{t('user.myTools')}</Tab>
              <Tab>{t('user.myBookings')}</Tab>
              <Tab>{t('rating.pendingRatings')}</Tab>
            </TabList>
            <TabPanels px={2}>
              <TabPanel>
                <UserTools />
              </TabPanel>
              <TabPanel>
                <UserBookings />
              </TabPanel>
              <TabPanel>
                <RatingsList />
              </TabPanel>
            </TabPanels>
          </Box>
        </Tabs>
      </Stack>
    </Container>
  )
}
