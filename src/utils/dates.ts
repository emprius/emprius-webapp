import { DateRange } from '~components/Tools/types'

export type DateInput = Date | number | string

/**
 * Returns the number of days between two dates
 * @param start - Date object, timestamp in milliseconds, or ISO date string
 * @param end - Date object, timestamp in milliseconds, or ISO date string
 */
export const getDaysBetweenDates = (start: DateInput, end: DateInput): number => {
  const startDate = convertToDate(start)
  const endDate = convertToDate(end)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date input')
  }

  const oneDayMs = 1000 * 60 * 60 * 24 // Milliseconds in a day
  const diffMs = Math.abs(endDate.getTime() - startDate.getTime()) // Absolute difference in milliseconds
  return Math.floor(diffMs / oneDayMs) // Convert to full days
}

export const convertToDate = (input: DateInput): Date => {
  if (input instanceof Date) return input
  if (typeof input === 'number') return new Date(input * 1000)
  return new Date(input)
}

export const addDayToDate = (date: DateInput) => {
  let dateObj = convertToDate(date) // Convert string to Date object
  dateObj.setDate(dateObj.getDate() + 1) // Add 1 day
  return dateObj
}

export const DateToEpoch = (date: DateInput) => Math.floor(new Date(date).getTime() / 1000)

export const isDateReserved = (date: Date, reservedDates: DateRange[]) => {
  return reservedDates.some((range) => {
    const fromDate = getStartOfDay(range.from)
    const toDate = getStartOfDay(range.to)

    return date >= fromDate && date <= toDate
  })
}

export const getStartOfDay = (date?: DateInput) => {
  const targetDate: Date = date ? convertToDate(date) : new Date()
  targetDate.setHours(0, 0, 0, 0)
  return targetDate
}

export const isToday = (date: Date): boolean => {
  return date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
}

/**
 * Check if two dates are on the same calendar day
 * @param date1 - Date object, timestamp in milliseconds, or ISO date string
 * @param date2 - Date object, timestamp in milliseconds, or ISO date string
 */
export const isSameDay = (date1: DateInput, date2: DateInput): boolean => {
  const d1 = convertToDate(date1)
  const d2 = convertToDate(date2)
  return d1.toISOString().slice(0, 10) === d2.toISOString().slice(0, 10)
}

/**
 * Check if two dates are in the same year
 * @param date1 - Date object, timestamp in milliseconds, or ISO date string
 * @param date2 - Date object, timestamp in milliseconds, or ISO date string
 */
export const isSameYear = (date1: DateInput, date2: DateInput): boolean => {
  const d1 = convertToDate(date1)
  const d2 = convertToDate(date2)
  return d1.getFullYear() === d2.getFullYear()
}

/**
 * Check if a date is yesterday
 * @param date - Date object, timestamp in milliseconds, or ISO date string
 */
export const isYesterday = (date: DateInput): boolean => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date, yesterday)
}

/**
 * Check if a date is within the past 7 days (not including today)
 * @param date - Date object, timestamp in milliseconds, or ISO date string
 */
export const isInPast7Days = (date: DateInput): boolean => {
  const targetDate = convertToDate(date)
  const today = getStartOfDay()
  const sevenDaysAgo = getStartOfDay()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  return targetDate >= sevenDaysAgo && targetDate < today
}
