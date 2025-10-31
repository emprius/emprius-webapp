// ContentParser component to detect and wrap links and emails
import { Fragment } from 'react'
import { Link } from '@chakra-ui/react'

export const MessageContent = ({ content }: { content: string }) => {
  const urlWithProtocolRegex = /^[a-zA-Z]+:\/\/.+/
  const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const isUrlWithProtocol = (word: string) => urlWithProtocolRegex.test(word)
  const isDomain = (word: string) => domainRegex.test(word)
  const isEmail = (word: string) => emailRegex.test(word)

  const words = content.split(/(\s+)/)

  return (
    <>
      {words.map((word, index) => {
        // Preserve whitespace
        if (/^\s+$/.test(word)) {
          return <Fragment key={index}>{word}</Fragment>
        }

        // Check if it's an email
        if (isEmail(word)) {
          return (
            <Link key={index} href={`mailto:${word}`} isExternal>
              {word}
            </Link>
          )
        }

        // Check if it's a URL with protocol
        if (isUrlWithProtocol(word)) {
          console.log('isUrlWithProtocol', word)
          return (
            <Link key={index} href={word} isExternal>
              {word}
            </Link>
          )
        }

        // Check if it's a domain without protocol
        if (isDomain(word)) {
          console.log('ISDOMAIN', word)
          return (
            <Link key={index} href={`https://${word}`} isExternal>
              {word}
            </Link>
          )
        }

        // Regular text
        return <Fragment key={index}>{word}</Fragment>
      })}
    </>
  )
}
