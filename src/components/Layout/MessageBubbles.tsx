import { useTranslation } from 'react-i18next'
import {
  Box,
  BoxProps,
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
import { MessageContent } from '~components/Layout/MessageContent'

export type MessageBubbleProps = {
  isAuthor?: boolean
  isRight?: boolean
  isDown?: boolean // Set avatar and comic tail to bottom alignment
  content?: string
  topComponent?: ReactNode
  at?: DateInput
  images?: string[]
  showAvatar?: boolean
  isRead?: boolean
  hideComicTail?: boolean
  bubbleProps?: BoxProps
} & FlexProps

export const MessageBubbles = ({
  id,
  content,
  topComponent,
  isAuthor = false,
  images,
  at,
  isRight = false,
  isDown = false,
  showAvatar = false,
  isRead,
  hideComicTail,
  bubbleProps,
  ...flexProps
}: MessageBubbleProps) => {
  const { t } = useTranslation()
  const textColor = useColorModeValue(isAuthor ? 'gray.700' : 'gray.800', isAuthor ? 'gray.200' : 'gray.100')
  const dateColor = useColorModeValue(isAuthor ? 'gray.400' : 'gray.500', isAuthor ? 'gray.500' : 'gray.400')
  const readTickColor = isRead ? 'blue.500' : 'gray.400'
  const datef = t('messages.datef_popover')

  return (
    <Flex justify={isRight ? 'end' : 'start'} direction={isRight ? 'row-reverse' : 'row'} {...flexProps}>
      {showAvatar && (
        <Box alignSelf={isDown && 'end'}>
          <UserAvatar id={id} size='sm' linkProfile />
        </Box>
      )}
      <Bubble isAuthor={isAuthor} isRight={isRight} isDown={isDown} hideComicTail={hideComicTail} {...bubbleProps}>
        {topComponent && topComponent}
        <VStack spacing={0} w={'full'}>
          {content && (
            <Text
              fontSize='sm'
              color={textColor}
              alignSelf={isRight ? 'end' : 'start'}
              pr={isRight ? 0 : '10px'}
              pl={isRight ? '10px' : 0}
              whiteSpace='pre-wrap'
              wordBreak='break-word'
              overflowWrap='break-word'
            >
              <MessageContent content={content} />
            </Text>
          )}
          {images && <ImagesGrid images={images} />}
          {at && (
            <HStack spacing={1} alignSelf={'end'}>
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
  isDown,
  isAuthor,
  hideComicTail,
  ...props
}: Pick<MessageBubbleProps, 'isAuthor' | 'isRight' | 'isDown' | 'hideComicTail'> & BoxProps & PropsWithChildren) => {
  const bubbleColor = useColorModeValue(isAuthor ? 'gray.100' : 'blue.50', isAuthor ? 'gray.700' : 'blue.800')

  let before = {
    content: "''",
    position: 'absolute',
    top: !isDown && '1em',
    bottom: isDown && '0.4em',
    left: isRight ? 'auto' : '-0.35em',
    right: isRight ? '-0.35em' : 'auto',
    width: '1.5em',
    height: '1.5em',
    bg: bubbleColor,
    clipPath: isRight ? 'polygon(50% 100%, 110% 0%, 40% 0%)' : 'polygon(50% 100%, 60% 0%, -10% 0%)',
  }
  return (
    <Box>
      <Box
        maxW='400px'
        p={3}
        bg={bubbleColor}
        color='white'
        borderRadius='1em'
        position='relative'
        _before={!hideComicTail && before}
        alignSelf={isRight ? 'flex-start' : 'flex-end'}
        {...props}
      >
        {children}
      </Box>
    </Box>
  )
}
