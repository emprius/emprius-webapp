import { Box, Button, Container, Heading, Icon, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { ParallaxBanner, ParallaxBannerLayer, ParallaxProvider } from 'react-scroll-parallax'

import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'

export const Landing = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const features = [
    {
      title: t('home.share_tools.title'),
      description: t('home.share_tools.description'),
      icon: icons.tools,
    },
    {
      title: t('home.find_what.title'),
      description: t('home.find_what.description'),
      icon: FiSearch,
    },
    {
      title: t('home.build_community.title'),
      description: t('home.build_community.description'),
      icon: icons.users,
    },
  ]

  return (
    <ParallaxProvider>
      <Box>
        {/* Hero Section with Parallax */}
        <ParallaxBanner style={{ height: '90vh' }}>
          <ParallaxBannerLayer
            speed={-20}
            style={{
              backgroundImage: 'url("/assets/ovelles.jpg")',
              backgroundSize: 'cover',
              opacity: 0.8,
            }}
          />
          <ParallaxBannerLayer
            speed={-5}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <Container maxW='container.xl'>
              <Stack
                direction={{ base: 'column', lg: 'row' }}
                spacing={{ base: 10, lg: 20 }}
                align='center'
                justify='space-between'
                py={{ base: 20, md: 28 }}
              >
                <Stack spacing={6} maxW='lg'>
                  <Heading
                    as='h1'
                    size='2xl'
                    fontWeight='bold'
                    lineHeight='shorter'
                    color='white'
                    textShadow='2px 2px 4px rgba(0,0,0,0.3)'
                  >
                    {t('home.title')}
                  </Heading>
                  <Text fontSize='xl' color='white' textShadow='1px 1px 2px rgba(0,0,0,0.3)'>
                    {t('home.subtitle')}
                  </Text>
                  <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                    <Button
                      size='lg'
                      colorScheme='primary'
                      onClick={() => navigate(ROUTES.SEARCH)}
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                      transition='all 0.3s'
                    >
                      {t('home.find_tools')}
                    </Button>
                    <Button
                      size='lg'
                      variant='outline'
                      colorScheme='primary'
                      onClick={() => navigate(ROUTES.TOOLS.NEW)}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'xl',
                        bg: 'rgba(255, 255, 255, 0.1)',
                      }}
                      transition='all 0.3s'
                      color='white'
                      borderColor='white'
                    >
                      {t('tools.add_tool')}
                    </Button>
                  </Stack>
                </Stack>
                <Box
                  maxW={{ base: '200px', sm: '350px', lg: '400px' }}
                  w='full'
                  h='auto'
                  position='relative'
                  transform='rotate(-5deg)'
                  transition='all 0.3s'
                  _hover={{ transform: 'rotate(0deg)' }}
                >
                  <Box
                    as='img'
                    src='/assets/logos/banner.png'
                    alt='Emprius'
                    w='full'
                    h='auto'
                    objectFit='contain'
                    filter='drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))'
                    maxW={{ base: '150px', sm: '300px', lg: '350px' }}
                  />
                </Box>
              </Stack>
            </Container>
          </ParallaxBannerLayer>
        </ParallaxBanner>

        {/* Features Section with Parallax */}
        <Box
          position='relative'
          bg={bgColor}
          minH={{ base: 'auto', md: '80vh' }}
          py={{ base: 16, md: 28 }}
          mb={{ base: 16, md: 0 }}
        >
          <Container maxW='container.xl'>
            <Stack spacing={12}>
              <Heading textAlign='center' size='xl' color='primary.600' mb={4}>
                {t('home.features')}
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 8, md: 10 }}>
                {features.map((feature, index) => (
                  <Stack
                    key={feature.title}
                    spacing={6}
                    bg={useColorModeValue('white', 'gray.700')}
                    p={8}
                    borderRadius='xl'
                    boxShadow='lg'
                    _hover={{
                      transform: 'translateY(-8px)',
                      boxShadow: '2xl',
                    }}
                    transition='all 0.4s ease-in-out'
                    border='1px'
                    borderColor={useColorModeValue('gray.100', 'gray.600')}
                    position='relative'
                    overflow='hidden'
                  >
                    <Box
                      position='absolute'
                      top='-20px'
                      right='-20px'
                      width='100px'
                      height='100px'
                      bg='primary.50'
                      borderRadius='full'
                      opacity='0.3'
                    />
                    <Icon as={feature.icon} w={12} h={12} color='primary.500' position='relative' zIndex={1} />
                    <Stack spacing={2}>
                      <Text fontSize='2xl' fontWeight='bold' color='primary.700'>
                        {feature.title}
                      </Text>
                      <Text color={textColor}>{feature.description}</Text>
                    </Stack>
                  </Stack>
                ))}
              </SimpleGrid>
            </Stack>
          </Container>
        </Box>

        {/* Community Section with Parallax */}
        <ParallaxBanner style={{ height: '90vh' }}>
          <ParallaxBannerLayer
            speed={-15}
            style={{
              backgroundImage: 'url("/assets/camps.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.8,
              filter: 'grayscale(100%)',
            }}
          />
          <ParallaxBannerLayer
            speed={-5}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            <Container maxW='container.xl'>
              <Stack spacing={8} maxW='2xl' mx='auto' textAlign='center' color='white'>
                <Heading size='2xl' fontWeight='bold' textShadow='2px 2px 4px rgba(0,0,0,0.3)'>
                  {t('home.build_community.title')}
                </Heading>
                <Text fontSize='xl' textShadow='1px 1px 2px rgba(0,0,0,0.3)'>
                  {t('home.build_community.description')}
                </Text>
                <Button
                  size='lg'
                  colorScheme='primary'
                  onClick={() => navigate(ROUTES.SEARCH)}
                  maxW='xs'
                  mx='auto'
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                  transition='all 0.3s'
                >
                  {t('home.find_tools')}
                </Button>
              </Stack>
            </Container>
          </ParallaxBannerLayer>
        </ParallaxBanner>
      </Box>
    </ParallaxProvider>
  )
}
