import { test, expect } from '@playwright/test'

test.describe('Basic application tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/')

    // Check if the page title is correct
    await expect(page).toHaveTitle(/Emprius/)

    // Check if some key elements are visible
    await expect(page.locator('body')).toBeVisible()
  })

  test('login page is accessible', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login')

    // Check if the login page has loaded
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()

    // Check if the email and password fields are present
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })
})
