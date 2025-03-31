/**
 * Authentication utilities for end-to-end tests
 *
 * This file contains helper functions for authentication-related operations
 * that can be reused across different test files.
 */

import { Page, expect } from '@playwright/test'
import { BACKEND_API_URL } from '../setup-backend'
import axios from 'axios'

export const invitationToken = process.env.REGISTER_TOKEN || 'test'

/**
 * Default test user credentials
 * These can be overridden by setting environment variables
 */
export const DEFAULT_TEST_USER = {
  email: 'test@example.com',
  password: 'Password123',
  community: `Test Community`,
}

/**
 * Login to the application with the provided credentials
 *
 * @param page - Playwright Page object
 * @param credentials - User credentials (email and password)
 * @returns Promise that resolves when login is complete and verified
 */
export async function login(
  page: Page,
  credentials: { email: string; password: string } = DEFAULT_TEST_USER
): Promise<void> {
  // Navigate to login page
  await page.goto('/login')

  // Wait for the login form to be visible
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()

  // Fill in login credentials
  await page.getByLabel(/email/i).fill(credentials.email)
  const passwordField = page.locator('input[type="password"]').first()
  await passwordField.fill(credentials.password)

  // Submit login form
  await page.getByRole('button', { name: /login/i }).click()

  // Wait a moment for any client-side redirects to complete
  await page.waitForTimeout(2000)

  // Verify successful registration - either we're redirected to home page or we see a success message
  try {
    // Check if we've been redirected to the home page
    await expect(page).toHaveURL('/', { timeout: 10000 })
  } catch (error) {
    // If not redirected, check for a success message or other indicator of successful registration
    console.log('Not redirected to home page, checking for success indicators...')

    // Check for success toast or message
    const successIndicator =
      page.locator('text=success').first() ||
      page.locator('text=registered').first() ||
      page.locator('.chakra-toast').first()

    await expect(successIndicator).toBeVisible({ timeout: 5000 })
  }
}

/**
 * Register the default test user via API
 */
export async function registerDefaultUser() {
  // Prepare the registration data based on DEFAULT_TEST_USER
  const registrationData = {
    email: DEFAULT_TEST_USER.email,
    password: DEFAULT_TEST_USER.password,
    community: DEFAULT_TEST_USER.community,
    name: 'Test User', // Adding a name since it might be needed
    invitationToken: invitationToken,
    // Adding a default location (centered in Barcelona)
    location: {
      latitude: 41379000, // Latitude in microdegrees
      longitude: 2174000, // Longitude in microdegrees
    },
  }

  try {
    // Make a direct API call to the /register endpoint using axios
    const response = await axios.post(`${BACKEND_API_URL}/register`, registrationData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('Default user registered successfully:', DEFAULT_TEST_USER.email)
    return true
  } catch (error) {
    const errMsg = error.response?.data?.header?.message as string
    if (errMsg.indexOf('duplicate key error')) {
      // 409 Conflict - User already exists, which is fine for our purpose
      console.log('User already exists, continuing with tests:', DEFAULT_TEST_USER.email)
      return true
    } else {
      console.error('Failed to register default user:', error.message)
      return false
    }
  }
}
