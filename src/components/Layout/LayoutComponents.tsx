import {Container, ContainerProps, SimpleGrid, SimpleGridProps} from '@chakra-ui/react'

/**
 * Container used on some layouts to wrap the content
 */
export const MainContainer = (props: ContainerProps) => (
  <Container {...props} maxW='container.xl' py={{ base: 3, md: 6 }} minH={'100vh'} />
)

/**
 * Simple grid used to show cards
 */
export const ResponsiveSimpleGrid = (props: SimpleGridProps) => (
  <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3, xl: 4 }} spacing={4} autoRows='auto' {...props} />
)
