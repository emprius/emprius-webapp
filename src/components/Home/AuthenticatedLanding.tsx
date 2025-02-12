import { Box, Container, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ParallaxBanner, ParallaxBannerLayer, ParallaxProvider } from 'react-scroll-parallax'
import { CategoryFilter, TransportFilter } from '~components/Home/AuthComponents/Filters'
import { LandingSearchBar } from '~components/Home/AuthComponents/SearchBar'
import { useSearchTools } from '~components/Search/queries'
import { defaultSearchParams, SearchFilters } from '~components/Search/SearchContext'
import { ToolList } from '~components/Tools/List'

export const AuthenticatedLanding = () => {
  // const { filters, setFilters } = useSearch()
  const { data: tools, isPending, isError, error, mutate } = useSearchTools()
  const [searchParams, setSearchParams] = useState<SearchFilters>({ ...defaultSearchParams, distance: 250000 })

  // Perform search when filters change
  useEffect(() => {
    mutate({
      ...searchParams,
    })
  }, [searchParams])

  return (
    <ParallaxProvider>
      <Box>
        <ParallaxBanner style={{ height: '60vh' }}>
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
            <Stack alignItems='center' w='full' maxW='container.xl' mx='auto' px={4} gap={0}>
              <Box
                as='img'
                src='/assets/extra/emprius_logo.png'
                alt='Emprius'
                w='full'
                maxW='400px'
                h='auto'
                mx='auto'
                filter='drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))'
              />
              <Stack
                w='full'
                maxW='800px'
                bg='whiteAlpha.900'
                py={4}
                px={2}
                borderRadius='lg'
                boxShadow='xl'
                align={'center'}
              >
                <LandingSearchBar />
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} w='full' px={4}>
                  <CategoryFilter setFilters={setSearchParams} filters={searchParams} />
                  <TransportFilter setFilters={setSearchParams} filters={searchParams} />
                </Stack>
              </Stack>
            </Stack>
          </ParallaxBannerLayer>
        </ParallaxBanner>
        <Container maxW='container.xl' mt={8}>
          <ToolList tools={tools?.tools || []} isLoading={isPending} isError={isError} error={error} />
        </Container>
      </Box>
    </ParallaxProvider>
  )
}
