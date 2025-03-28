import { format, formatDistance, Locale } from 'date-fns'
import i18next from 'i18next'
import BrowserLanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { LanguagesSlice } from '~i18n/languages.mjs'
import { dateLocales, translations } from '~i18n/locales'
import { TOKEN_SYMBOL } from '~utils/constants'
import { currency, ucfirst } from '~utils/strings'

const i18n = i18next.createInstance()
i18n
  .use(BrowserLanguageDetector)
  .use(initReactI18next)
  .init(
    {
      fallbackLng: 'en',
      debug: import.meta.env.NODE_ENV === 'development',
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false,
      },
      returnEmptyString: false,
    },
    (err, t) => {
      if (err) {
        console.error('i18next init error:', err)
        return
      }
      // ensure that the current language is the resolved one
      if (i18n.resolvedLanguage !== i18n.language) {
        i18n.changeLanguage(i18n.resolvedLanguage)
      }
    }
  )

for (const lang of Object.keys(LanguagesSlice)) {
  if (typeof translations[lang] !== 'undefined') {
    i18n.addResourceBundle(lang, 'translation', translations[lang])
  }
}

/**
 * Configurable way of translating relative times (like "3 months ago" or "in 5 days")
 */
i18n.services.formatter?.add('relative', (value: any, lng: string | undefined, options: any) => {
  const opts: { locale?: Locale } = {}
  const now = new Date()
  if (lng && lng !== 'en') {
    opts.locale = dateLocales[lng]
  }

  const relative = formatDistance(now, value, opts)

  if (!options.future && !options.past) {
    return relative
  }
  if (now < value) {
    return options.future.replace('%time', relative)
  }
  return options.past.replace('%time', relative)
})

/**
 * Interpolates a duration between date.begin and date.end
 */
i18n.services.formatter?.add('duration', (value: any, lng: string | undefined, options: any) => {
  const opts: { locale?: Locale } = {}
  if (lng && lng !== 'en') {
    opts.locale = dateLocales[lng]
  }

  return formatDistance(value.begin, value.end, opts)
})

/**
 * A cooler way of formatting dates than the one provided by i18next
 */
i18n.services.formatter?.add('format', (value: any, lng: string | undefined, options: any) => {
  const opts: { locale?: Locale } = {}
  if (lng && lng !== 'en') {
    opts.locale = dateLocales[lng]
  }
  
  return format(value, options.format, opts)
})

/**
 * Uppercase
 */
i18n.services.formatter?.add('uppercase', (value: string, lng: string | undefined, options: any) =>
  value.toLocaleUpperCase(lng)
)

/**
 * Lowercase
 */
i18n.services.formatter?.add('lowercase', (value: string, lng: string | undefined, options: any) =>
  value.toLocaleLowerCase(lng)
)

/**
 * ucfirst
 */
i18n.services.formatter?.add('ucfirst', (value: string, lng: string | undefined) => ucfirst(value, lng))

/**
 * Currency
 */
i18n.services.formatter?.add('currency', (amount: number, lng?: string | undefined) => currency(amount, lng))

/**
 * Token symbol
 */
i18n.services.formatter?.add('tokensymbol', () => TOKEN_SYMBOL)

export default i18n
