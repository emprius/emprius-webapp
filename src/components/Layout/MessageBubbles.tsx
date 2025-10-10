import { useTranslation } from 'react-i18next'
import {
  Box,
  Flex,
  FlexProps,
  HStack,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { LuCheckCheck } from 'react-icons/lu'
import { UserAvatar } from '~components/Images/Avatar'
import { convertToDate, DateInput } from '~utils/dates'
import { PropsWithChildren, ReactNode } from 'react'
import { ImagesGrid } from '~components/Images/ImagesGrid'

export type MessageBubbleProps = {
  isAuthor?: boolean
  isRight?: boolean
  content?: string
  topComponent?: ReactNode
  at?: DateInput
  images?: string[]
  showAvatar?: boolean
  isRead?: boolean
} & FlexProps

export const MessageBubbles = ({
  id,
  content,
  topComponent,
  isAuthor = false,
  images,
  at,
  isRight = false,
  showAvatar = false,
  isRead,
  ...flexProps
}: MessageBubbleProps) => {
  const { t } = useTranslation()
  const textColor = useColorModeValue(isAuthor ? 'gray.700' : 'gray.800', isAuthor ? 'gray.200' : 'gray.100')
  const dateColor = useColorModeValue(isAuthor ? 'gray.400' : 'gray.500', isAuthor ? 'gray.500' : 'gray.400')
  const readTickColor = isRead ? 'blue.500' : 'gray.400'
  const datef = t('messages.datef_popover')

  return (
    <Flex justify={isRight ? 'end' : 'start'} direction={isRight ? 'row-reverse' : 'row'} {...flexProps}>
      {showAvatar && <UserAvatar id={id} size='sm' linkProfile />}
      <Bubble isAuthor={isAuthor} isRight={isRight}>
        {topComponent && (
          <HStack justify={isRight ? 'end' : 'start'} pr={isRight ? 0 : '20px'} pl={isRight ? 'auto' : 0}>
            {topComponent}
          </HStack>
        )}
        <VStack spacing={0} w={'full'}>
          {content && (
            <Text
              fontSize='sm'
              color={textColor}
              alignSelf={isRight ? 'end' : 'start'}
              pr={isRight ? 0 : '10px'}
              pl={isRight ? '10px' : 0}
              whiteSpace='pre-wrap'
            >
              {content}
            </Text>
          )}
          {images && <ImagesGrid images={images} />}
          {at && (
            <HStack spacing={1} alignSelf={isRight ? 'start' : 'end'}>
              <Popover>
                <PopoverTrigger>
                  <Text fontSize='xs' color={dateColor} cursor='pointer'>
                    {t('messages.date_formatted', { date: convertToDate(at) })}
                  </Text>
                </PopoverTrigger>
                <PopoverContent bg='gray.700' color={'white'} maxW={'170px'} py={1}>
                  <Box w={'full'} textAlign={'center'}>
                    {t('messages.date_popover', {
                      date: convertToDate(at),
                      format: datef,
                    })}
                  </Box>
                </PopoverContent>
              </Popover>
              {isAuthor && isRead != undefined && <Icon as={LuCheckCheck} color={readTickColor} boxSize={4} />}
            </HStack>
          )}
        </VStack>
      </Bubble>
    </Flex>
  )
}

const Bubble = ({
  children,
  isRight,
  isAuthor,
}: Pick<MessageBubbleProps, 'isAuthor' | 'isRight'> & PropsWithChildren) => {
  const bubbleColor = useColorModeValue(isAuthor ? 'gray.100' : 'blue.50', isAuthor ? 'gray.700' : 'blue.800')
  return (
    <Box>
      <Box
        maxW='400px'
        p={3}
        bg={bubbleColor}
        color='white'
        borderRadius='1em'
        position='relative'
        _before={{
          content: "''",
          position: 'absolute',
          top: '1em',
          left: isRight ? 'auto' : '-0.4em',
          right: isRight ? '-0.4em' : 'auto',
          width: '1.5em',
          height: '1.5em',
          bg: bubbleColor,
          clipPath: isRight ? 'polygon(70% 100%, 100% 0%, 50% 0%)' : 'polygon(30% 100%, 60% 0%, 0% 0%)',
        }}
        alignSelf={isRight ? 'flex-start' : 'flex-end'}
      >
        {children}
      </Box>
    </Box>
  )
}
