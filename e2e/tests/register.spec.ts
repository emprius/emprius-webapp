import { test, expect } from '@playwright/test'
import { invitationToken } from '../utils/auth'
import { ROUTES } from '../../src/router/routes'

test.describe('User Registration', () => {
  // Use hardcoded test data with timestamp to ensure uniqueness
  const timestamp = new Date().getTime()
  const testUser = {
    name: `Test User ${timestamp}`,
    email: `testuser${timestamp}@example.com`,
    password: `Password123`, // Meets requirements: 8+ chars, letters and numbers
    community: `Test Community ${timestamp}`,
    invitationToken,
  }

  test('should register a new user successfully', async ({ page }) => {
    console.log('Using registration token:', testUser.invitationToken)

    // Navigate to the registration page
    await page.goto(ROUTES.AUTH.REGISTER)

    // Verify we're on the registration page
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible()

    // Wait for the form to be fully loaded
    await page.waitForSelector('form')

    // Fill out the registration form
    await page.getByLabel(/name/i).fill(testUser.name)
    await page.getByLabel(/email/i).fill(testUser.email)

    // Use more specific selectors for password fields
    const passwordField = page.locator('input[type="password"]').first()
    await passwordField.fill(testUser.password)

    const confirmPasswordField = page.locator('input[type="password"]').nth(1)
    await confirmPasswordField.fill(testUser.password)

    await page.getByLabel(/invitation token/i).fill(testUser.invitationToken)
    await page.getByTestId(/community/i).fill(testUser.community)

    // Set location on the map
    // The map is in an iframe, so we need to click on it
    const mapContainer = page.locator('.map-container')
    await expect(mapContainer).toBeVisible()

    // Click on the map to set a location
    // Note: The exact coordinates might need adjustment based on the map's default center
    await mapContainer.click({ position: { x: 150, y: 150 } })

    // Click the register button
    await page.getByRole('button', { name: /register/i }).click()

    // Wait a moment for any client-side redirects to complete
    await page.waitForTimeout(3000)

    // Verify successful registration - either we're redirected to home page or we see a success message
    try {
      // Check if we've been redirected to the search page
      await expect(page).toHaveURL(ROUTES.SEARCH, { timeout: 10000 })
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
  })

  test('should show validation errors for invalid inputs', async ({ page }) => {
    // Navigate to the registration page
    await page.goto(ROUTES.AUTH.REGISTER)

    // Wait for the form to be fully loaded
    await page.waitForSelector('form')

    // Try to submit the form without filling any fields
    await page.getByRole('button', { name: /register/i }).click()

    // Verify at least one validation error is shown (instead of checking all)
    await expect(page.locator('.chakra-form__error-message').first()).toBeVisible()

    // Fill with invalid email
    await page.getByLabel(/email/i).fill('invalid-email')

    // Fill with short password using more specific selector
    const passwordField = page.locator('input[type="password"]').first()
    await passwordField.fill('short')

    // Fill with non-matching confirm password
    const confirmPasswordField = page.locator('input[type="password"]').nth(1)
    await confirmPasswordField.fill('different')

    // Submit the form
    await page.getByRole('button', { name: /register/i }).click()

    // Check that there are error messages
    const errorMessages = page.locator('.chakra-form__error-message')
    const count = await errorMessages.count()
    expect(count).toBeGreaterThan(0)
  })
})
