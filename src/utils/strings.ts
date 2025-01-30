/**
 * ucfirst makes the first letter of a string uppercase
 */
export const ucfirst = (str: string, lng?: string | undefined) => str.charAt(0).toLocaleUpperCase(lng) + str.slice(1)

/**
 * Format a number as currency in EUR
 */
export const currency = (amount: number, lng?: string | undefined): string => {
  return new Intl.NumberFormat(lng, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}
