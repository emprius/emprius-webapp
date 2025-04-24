import React, { useMemo, useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Button,
  useToast,
  Box,
  useColorModeValue,
  Heading,
  Text,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'
import { lighterText, lightText } from '~theme/common'
import { Invite } from '~components/Users/types'
import { useRequestMoreCodes } from '~components/Users/queries'
import { ROUTES } from '~src/router/routes'

const InviteCodes = ({ codes }: { codes: Invite[] }) => {
  const [isSharing, setIsSharing] = useState(false)
  const { t } = useTranslation()
  const toast = useToast()
  const isWebShareSupported = useMemo(() => navigator.share !== undefined, [navigator.share])
  const { mutateAsync, isError, error, isPending } = useRequestMoreCodes()

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copied to clipboard!',
        description: 'The content has been copied to your clipboard.',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Failed to copy:', error)
      toast({
        title: 'Failed to copy',
        description: 'Could not access clipboard. Please copy manually.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleShare = async (invite: string) => {
    setIsSharing(true)
    try {
      const inviteUrl = `${window.location.host}${ROUTES.AUTH.REGISTER}?invite=${invite}`
      if (isWebShareSupported) {
        await navigator.share({
          title: 'Check this out',
          text: inviteUrl,
        })

        toast({
          title: 'Shared successfully!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      } else {
        await handleCopy(inviteUrl)
      }
    } catch (error) {
      console.error('Failed to copy:', error)
      toast({
        title: 'Failed to copy',
        description: 'Could not access clipboard. Please copy manually.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSharing(false)
    }
  }

  const requestMoreCodes = async () => {
    try {
      await mutateAsync()
      toast({
        title: t('common.success'),
        description: t('invite_codes.more_codes_requested', { defaultValue: 'More codes requested' }),
        status: 'success',
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.something_went_wrong'),
        status: 'error',
      })
    }
  }

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const datef = t('invite_codes.datef', { defaultValue: 'P' })

  return (
    <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor} w={'full'}>
      <Heading size='md' mb={4}>
        {t('invite_codes.title', { defaultValue: 'Invite codes' })}
      </Heading>
      <Text sx={lightText} mb={4}>
        {t('invite_codes.helper_desc', {
          defaultValue:
            'Invite codes and invite links are used during registration and allow others to create an account. They do not expire and can be shared freely.',
        })}
      </Text>
      {codes && (
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>{t('invite_codes.code', { defaultValue: 'Invite code' })}</Th>
              <Th>{t('invite_codes.created_on', { defaultValue: 'Created on' })}</Th>
              <Th>{t('invite_codes.share_link', { defaultValue: 'Invite link' })}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {codes?.map(({ code, createdOn }, index) => (
              <Tr key={index}>
                <Td>
                  {code}
                  <IconButton
                    aria-label='Copy text'
                    icon={<CopyIcon />}
                    size='sm'
                    ml={2}
                    onClick={() => handleCopy(code)}
                    variant='ghost'
                  />
                </Td>
                <Td>
                  {t('invite_codes.date_formatted', {
                    date: createdOn,
                    format: datef,
                    defaultValue: '{{ date, format }}',
                  })}
                </Td>
                <Td>
                  <Button
                    leftIcon={<ExternalLinkIcon />}
                    colorScheme='blue'
                    size='sm'
                    onClick={() => handleShare(code)}
                    disabled={isSharing}
                  >
                    {t('invite_codes.invite_link', { defaultValue: 'Invite' })}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      <VStack align={'end'} mt={4}>
        <Button isLoading={isPending} onClick={requestMoreCodes} disabled={!!codes?.length}>
          {t('invite_codes.request_more_codes', { defaultValue: 'Request more codes' })}
        </Button>
        <Text sx={lighterText}>
          {t('invite_codes.get_more_codes', {
            defaultValue: 'If you run out of codes, click the button to get additional ones.',
          })}
        </Text>
      </VStack>
    </Box>
  )
}

export default InviteCodes
