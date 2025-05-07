import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDefaultUserCommunities } from '~components/Communities/queries'
import { chakraComponents, Select } from 'chakra-react-select'
import { FormControl, FormErrorMessage, FormLabel, HStack, Text } from '@chakra-ui/react'
import { Avatar } from '~components/Images/Avatar'
import { lighterText } from '~theme/common'
import { Controller } from 'react-hook-form'
import { ToolFormData } from '~components/Tools/Form'

interface CommunitiesSelectorProps {
  control: any
  setValue: (name: keyof ToolFormData, value: any) => void
  watch: (name: keyof ToolFormData) => any
  errors: any
}

export const CommunitiesSelector: React.FC<CommunitiesSelectorProps> = ({ control, setValue, watch, errors }) => {
  const { t } = useTranslation()
  const { data: userCommunities, isLoading } = useDefaultUserCommunities()

  // If there are no communities or still loading, return null
  if ((!userCommunities || userCommunities.length === 0) && !isLoading) {
    return null
  }

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

  // Custom multi-value component to display selected communities with avatars
  const CustomMultiValueContainer = ({ children, ...props }: any) => {
    return (
      <chakraComponents.MultiValueContainer {...props}>
        <HStack>
          <Avatar avatarHash={props.data.avatarHash} username={props.data.label} size='2xs' />
          {children}
        </HStack>
      </chakraComponents.MultiValueContainer>
    )
  }

  return (
    <FormControl isInvalid={!!errors.communities}>
      <FormLabel>{t('tools.communities', { defaultValue: 'Share with Communities' })}</FormLabel>
      <Text fontSize='sm' sx={lighterText}>
        {t('tools.communities_description', {
          defaultValue: 'The tool will only be visible for the members of the communities where you share it',
        })}
      </Text>
      <Controller
        name='communities'
        control={control}
        render={({ field }) => (
          <Select
            isDisabled={true}
            isMulti
            options={userCommunities?.map((community) => ({
              value: community.id,
              label: community.name,
              avatarHash: community.image,
            }))}
            placeholder={t('tools.select_communities', { defaultValue: 'Select communities' })}
            onChange={(newValue: any) => {
              setValue('communities', newValue ? newValue.map((item: any) => item.value) : [])
            }}
            value={
              userCommunities && watch('communities')
                ? watch('communities')
                    .map((id: string) => {
                      const community = userCommunities.find((c) => c.id === id)
                      return community
                        ? {
                            value: community.id,
                            label: community.name,
                            avatarHash: community.image,
                          }
                        : null
                    })
                    .filter(Boolean)
                : []
            }
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
  )
}
