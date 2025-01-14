import React from 'react'
import { Box, Center, Container, Heading, Spinner } from '@chakra-ui/react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EditToolForm } from '../components/EditToolForm'
import { useAuth } from '~src/features/auth/context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { tools } from '~src/services/api'

export const EditToolPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    data: tool,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tool', id],
    queryFn: () => tools.getById(id!),
    enabled: !!id, // Only run query if we have an ID
    retry: false, // Don't retry on error
  })

  if (isLoading) {
    return (
      <Center h='100vh'>
        <Spinner size='xl' />
      </Center>
    )
  }

  if (isError) {
    return <Navigate to='/404' />
  }

  // Only allow tool owner to access this page
  if (!user || !tool || user.email !== tool.userId) {
    return <Navigate to={`/tools/${id}`} replace />
  }

  return (
    <Container maxW='container.md' py={8}>
      <Heading mb={6}>{t('tools.editTool')}</Heading>
      <Box bg='white' p={6} borderRadius='lg' shadow='sm'>
        <EditToolForm initialData={tool} onSuccess={() => navigate(`/tools/${id}`)} />
      </Box>
    </Container>
  )
}
