import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCommunityDetail, useSearchUserCommunities } from '~components/Communities/queries'
import { chakraComponents, Select } from 'chakra-react-select'
import { FormControl, FormErrorMessage, FormLabel, HStack, Icon, Stack, Switch, Text } from '@chakra-ui/react'
import { Avatar } from '~components/Images/Avatar'
import { Controller } from 'react-hook-form'
import { ToolFormData } from '~components/Tools/Form'
import { icons } from '~theme/icons'

interface CommunitiesSelectorProps {
  control: any
  setValue: (name: keyof ToolFormData, value: any) => void
  watch: (name: keyof ToolFormData) => any
  errors: any
  hasCommunities: boolean
}

export const CommunitiesSelector: React.FC<CommunitiesSelectorProps> = ({
  control,
  setValue,
  watch,
  errors,
  hasCommunities,
}) => {
  const { t } = useTranslation()
  const [shareGlobally, setShareGlobally] = useState(!hasCommunities)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Use the search query with debounced term for dropdown options
  const { data: searchData, isLoading } = useSearchUserCommunities(debouncedSearchTerm || undefined)
  const dropdownCommunities = searchData?.communities || []

  // Custom option component to display community avatar and name
  const CustomOption = ({ children, ...props }: any) => {
    return (
      <chakraComponents.Option {...props}>
        <HStack>
          <Avatar avatarHash={props.data.avatarHash} username={props.data.label} size='xs' />
          <span>{children}</span>
        </HStack>
      </chakraComponents.Option>
    )
  }

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setShareGlobally(checked)
    if (checked) {
      setValue('communities', [])
    }
  }

  return (
    <Stack spacing={2}>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align='start'>
        <FormControl display='flex' flexDirection={'column'} alignItems='start' width='auto' gap={1}>
          <FormLabel htmlFor='isFree'>
            <HStack>
              <Icon as={icons.globe} />
              <Text>
                {t('tools.share_globally', {
                  defaultValue: 'Share globally',
                })}
              </Text>
            </HStack>
          </FormLabel>
          <Text fontSize='sm' color='lighterText'>
            {t('tools.share_globally_desc', {
              defaultValue: 'Share this tool with everybody',
            })}
          </Text>
          <Switch mt={4} id='isFree' isChecked={shareGlobally} onChange={handleSwitchChange} size={'lg'} />
        </FormControl>
        <FormControl flex={1} isDisabled={shareGlobally} isInvalid={!!errors.communities} isRequired={!shareGlobally}>
          <FormLabel display={'flex'} alignItems={'center'} gap={2} htmlFor='communities'>
            <Icon as={icons.communities} />
            <Text>{t('tools.communities', { defaultValue: 'Share with Communities' })}</Text>
          </FormLabel>
          <Text fontSize='sm' color='lighterText'>
            {t('tools.communities_description', {
              defaultValue: 'The tool will only be visible for the members of the communities where you share it',
            })}
          </Text>
          <Controller
            name='communities'
            control={control}
            disabled={shareGlobally}
            render={({ field }) => (
              <Select
                isDisabled={shareGlobally}
                isMulti
                isSearchable
                filterOption={() => true} // Disable client-side filtering since we're doing server-side
                onInputChange={(inputValue) => setSearchTerm(inputValue)}
                options={dropdownCommunities?.map((community) => ({
                  value: community.id,
                  label: community.name,
                  avatarHash: community.image,
                }))}
                placeholder={t('tools.select_communities', { defaultValue: 'Select communities' })}
                noOptionsMessage={() =>
                  isLoading
                    ? t('common.loading', { defaultValue: 'Loading...' })
                    : t('tools.no_communities_found', { defaultValue: 'No communities found' })
                }
                onChange={(newValue: any) => {
                  setValue('communities', newValue)
                }}
                value={watch('communities')}
                components={{
                  Option: CustomOption,
                  MultiValueContainer: CustomMultiValueContainer,
                }}
                chakraStyles={{
                  menuList: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                  }),
                }}
              />
            )}
          />
          <FormErrorMessage>{errors.communities?.message}</FormErrorMessage>
        </FormControl>
      </Stack>
    </Stack>
  )
}

// Custom multi-value component to display selected communities with avatars
const CustomMultiValueContainer = ({ children, ...props }: any) => {
  const { data } = useCommunityDetail(props.data.value, {
    enabled: !!props.data.label,
  })

  const avatar = props.data.avatarHash || data?.image || ''
  const label = props.data.label || data?.name || ''

  return (
    <chakraComponents.MultiValueContainer {...props}>
      <HStack>
        <Avatar avatarHash={avatar} username={label} size='2xs' isSquare />
        {!props.data.label ? (
          <>
            {label}
            {children[1]}
          </>
        ) : (
          children
        )}
      </HStack>
    </chakraComponents.MultiValueContainer>
  )
}
