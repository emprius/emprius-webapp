/**
 * General test utilities for end-to-end tests
 *
 * This file contains helper functions and utilities that can be
 * reused across different test files.
 */

import { Page } from '@playwright/test'
import path from 'path'
import { promises as fs } from 'fs'

/**
 * Generate a unique test data object with timestamp
 *
 * @param prefix - Optional prefix for the generated data
 * @returns Object with unique test data
 */
export function generateUniqueTestData(prefix: string = 'Test') {
  const timestamp = new Date().getTime()
  return {
    title: `${prefix} ${timestamp}`,
    description: `This is a test item created at ${timestamp}`,
    uniqueId: timestamp.toString(),
  }
}

/**
 * Create a small test image as a buffer
 * This is useful for file upload tests
 *
 * @returns Buffer containing a minimal PNG image
 */
export function createTestImageBuffer(): Buffer {
  // This is a minimal 1x1 transparent PNG
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  )
}

/**
 * Upload a test image to a file input
 *
 * @param page - Playwright Page object
 * @param selector - Selector for the file input element
 * @param imageName - Name to give the test image
 * @returns Promise that resolves when the upload is complete
 */
export async function uploadTestImage(
  page: Page,
  selector: string,
  imageName: string = 'test-image.png'
): Promise<void> {
  const fileInput = page.locator(selector)
  await fileInput.setInputFiles({
    name: imageName,
    mimeType: 'image/png',
    buffer: createTestImageBuffer(),
  })

  // Give time for the image to be processed
  await page.waitForTimeout(1000)
}

export const writeReport = async (page: Page, name: string = 'test-report') => {
  // Use absolute path to the playwright-report directory at the project root
  const reportDir = path.resolve(process.cwd(), 'playwright-report')
  await fs.mkdir(reportDir, { recursive: true }) // Ensure directory exists

  const reportPath = path.join(reportDir, name)
  console.log(`Saving report: ${reportPath}`)

  const htmlContent = await page.content()
  await fs.writeFile(`${reportPath}.html`, htmlContent, 'utf-8')
  await page.screenshot({ path: `${reportPath}.png` })
}
