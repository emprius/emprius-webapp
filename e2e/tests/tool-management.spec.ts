/**
 * NOTE: these tests are skipped because cannot go forward from login screen when
 * running GitHub action.
 * However, they work properly locally. Check when time
 */
import { test, expect, Page } from '@playwright/test'
import { login } from '../utils/auth'
import { generateUniqueTestData, uploadTestImage } from '../utils/test-utils'
import { ROUTES } from '../../src/router/routes'

/**
 * Default test tool data
 */
export function getDefaultToolData() {
  const testData = generateUniqueTestData('ToolTest')
  return {
    title: testData.title,
    description: testData.description,
    category: 'other', // This should match one of the available categories
    estimatedValue: '100',
    height: '50',
    weight: '10',
  }
}

/**
 * Tests in order to avoid executing test without a already created tool
 */
test.describe.serial('Tool Management', () => {
  /**
   * Test data with timestamp to ensure uniqueness across test runs
   */
  const testTool = getDefaultToolData()

  /**
   * Before each test, log in to the application
   * This ensures all tests start from an authenticated state
   */
  test.beforeEach(async ({ page }) => {
    // Ensure we start from a clean state
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await login(page)
  })

  /**
   * Test: Create a new tool with all fields filled
   *
   * This test verifies that a user can:
   * 1. Navigate to the tool creation page
   * 2. Fill out all fields in the form
   * 3. Submit the form successfully
   * 4. Be redirected to the tools list page
   * 5. See the newly created tool in the list
   */
  test.skip('should create a new tool successfully', async ({ page }) => {
    // First navigate to the tools list page
    await gotoAddToolPage(page)

    // Fill out the tool form
    try {
      await page.getByLabel(/name/i).fill(testTool.title)

      // Select a category from the dropdown
      // const categoryDropdown = page.locator('div[id*="react-select"]').first()
      const categoryDropdown = page.locator('[role="combobox"]').first()
      await categoryDropdown.click()
      await page.getByText(testTool.category, { exact: false }).first().click()

      // Fill description
      await page.getByLabel(/description/i).fill(testTool.description)

      // Set location on the map
      const mapContainer = page.locator('.map-container')
      await expect(mapContainer).toBeVisible()
      // await mapContainer.click({ position: { x: 150, y: 150 } })

      // Upload an image if requested
      await uploadTestImage(page, 'input[type="file"]')

      // Expand additional options
      await page.getByRole('button', { name: /additional options/i }).click()

      // Fill height and weight
      await page.getByLabel(/height/i).fill(testTool.height)
      await page.getByLabel(/weight/i).fill(testTool.weight)
    } catch (error) {
      throw error
    }

    // Submit the form and wait for the response
    try {
      const submitButton = page.getByRole('button', { name: /create/i })
      await expect(submitButton).toBeVisible({ timeout: 5000 })

      // Set up response promise before clicking
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/tools') && response.status() === 200,
        { timeout: 20000 }
      )

      await submitButton.click()
      await responsePromise
    } catch (error) {
      throw error
    }

    // Verify successful creation - we should be redirected to the tools list page
    try {
      await expect(page).toHaveURL('/tools', { timeout: 15000 })
      // Check for success toast
      await expect(page.locator('.chakra-toast').first()).toBeVisible({ timeout: 10000 })
      // Verify the tool appears in the list
      await expect(page.getByText(testTool.title)).toBeVisible({ timeout: 10000 })
    } catch (error) {
      throw error
    }
  })

  /**
   * Test: Form validation for invalid inputs
   *
   * This test verifies that:
   * 1. The form shows validation errors when submitted with empty required fields
   * 2. The form validates numeric fields for negative values
   * 3. The form handles boundary conditions for numeric inputs
   */
  // test('should show validation errors for invalid inputs', async ({ page }) => {
  //   await gotoAddToolPage(page)
  //   // Try to submit the form without filling required fields
  //   await page.getByRole('button', { name: /create/i }).click()
  //
  //   try {
  //     const kk = await page.content()
  //     // Verify validation errors are shown for required fields
  //     await expect(page.locator('.chakra-form__error-message').first()).toBeVisible()
  //
  //     // Test invalid estimated value
  //     // Fill in the required fields except estimated value
  //     await page.getByLabel(/name/i).fill(testTool.title)
  //
  //     // Select a category from the dropdown
  //     const categoryDropdown = page.locator('div[id*="react-select"]').first()
  //     await categoryDropdown.click()
  //     await page.getByText(testTool.category, { exact: false }).first().click()
  //
  //     // Set location on the map
  //     const mapContainer = page.locator('.map-container')
  //     await expect(mapContainer).toBeVisible()
  //     await mapContainer.click({ position: { x: 150, y: 150 } })
  //
  //     // Enter an invalid negative value for estimated value
  //     await page.getByLabel(/estimated value/i).fill('-50')
  //
  //     // Submit the form
  //     await page.getByRole('button', { name: /create/i }).click()
  //
  //     // Verify validation error for estimated value
  //     const errorMessages = page.locator('.chakra-form__error-message')
  //     await expect(errorMessages.first()).toBeVisible()
  //
  //     // Test boundary conditions for numeric fields
  //     // Enter extremely large values for height and weight
  //     await page.getByRole('button', { name: /additional options/i }).click()
  //
  //     // Enter a very large number for height
  //     await page.getByLabel(/height/i).fill('9999999999')
  //
  //     // Enter a very large number for weight
  //     await page.getByLabel(/weight/i).fill('9999999999')
  //
  //     // Submit the form
  //     await page.getByRole('button', { name: /create/i }).click()
  //   } catch (error) {
  //     await page.screenshot({ path: 'form-fill-error.png' })
  //     throw error
  //   }
  // })

  /**
   * Test: Edit an existing tool
   *
   * This test verifies that a user can:
   * 2. Navigate to the tool's detail page
   * 3. Access the edit page
   * 4. Modify the tool's details
   * 5. Save the changes successfully
   * 6. See the updated information on the detail page
   */
  test.skip('should edit an existing tool successfully', async ({ page }) => {
    // Navigate to the first tool's detail page
    await navigateToToolDetail(page)

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    try {
      // Find the edit link using regex pattern: /tools/{toolId}/edit
      const editLink = page.locator('a[href*="/tools/"][href*="/edit"]').first()

      if ((await editLink.count()) > 0) {
        await editLink.click()
      } else {
        // As a fallback, try to navigate directly to the edit URL
        const currentUrl = page.url()
        const toolId = currentUrl.match(/\/tools\/(\d+)/)?.[1]
        if (toolId) {
          await page.goto(`/tools/${toolId}/edit`)
        } else {
          throw new Error('Could not find edit link or determine tool ID for direct navigation')
        }
      }
    } catch (error) {
      console.error('Error finding edit button:', error)
      throw error
    }

    // Wait for the edit page to load
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)

    // Try multiple selectors to verify we're on the edit page
    try {
      const editHeading = page.getByRole('heading', { name: /edit tool/i })
      const editForm = page.locator('form').filter({ hasText: /name|title|description/i })

      if ((await editHeading.count()) > 0) {
        await expect(editHeading).toBeVisible({ timeout: 10000 })
      } else if ((await editForm.count()) > 0) {
        await expect(editForm).toBeVisible({ timeout: 10000 })
      } else {
        // Check if we're on a URL that looks like an edit page
        await expect(page).toHaveURL(/\/tools\/\d+\/edit|\/edit-tool/, { timeout: 10000 })
      }
    } catch (error) {
      throw error
    }

    // Wait for the form to be fully loaded
    await page.waitForSelector('button[type="submit"], button:has-text("Save")', { timeout: 15000 })

    // Update the tool details
    const updatedTitle = `Updated ${testTool.title}`
    const updatedDescription = `This tool was updated at ${new Date().toISOString()}`

    // Clear and update the title
    await page.getByLabel(/name/i).clear()
    await page.getByLabel(/name/i).fill(updatedTitle)

    // Clear and update the description
    await page.getByLabel(/description/i).clear()
    await page.getByLabel(/description/i).fill(updatedDescription)

    // Expand additional options
    await page.getByRole('button', { name: /additional options/i }).click()

    // Update height and weight
    await page.getByLabel(/height/i).clear()
    await page.getByLabel(/height/i).fill('75')

    await page.getByLabel(/weight/i).clear()
    await page.getByLabel(/weight/i).fill('25')

    // Save the changes
    const updateResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/tools') && response.status() === 200,
      { timeout: 15000 }
    )

    await page.getByRole('button', { name: /save/i }).click()
    await updateResponsePromise

    // Verify we're redirected to the tool detail page
    await expect(page).toHaveURL(/\/tools\/\d+$/)

    // Verify the updated details are displayed
    await expect(page.getByText(updatedTitle).first()).toBeVisible()
    await expect(page.getByText(updatedDescription).first()).toBeVisible()
  })

  /**
   * Test: Toggle tool availability
   *
   * This test verifies that a tool owner can:
   * 1. Navigate to a tool's detail page
   * 2. Toggle the availability status
   * 3. See the updated availability status
   *
   * Note: This test will be skipped if the current user is not the owner of any tools
   */
  test.skip('should toggle tool availability', async ({ page }) => {
    // Navigate to the first tool's detail page
    await navigateToToolDetail(page)

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Check if the current user is the owner (availability toggle is visible)
    // The AvailabilityToggle component uses a Switch from Chakra UI
    // Find the switch label (not the input which is visually hidden)
    const switchLabel = page.locator('label.chakra-switch').first()

    // Wait for the status badge to be visible
    await page.waitForSelector('span.chakra-badge', { timeout: 10000 })

    // Get the current availability status
    const initialStatus = await page.locator('span.chakra-badge').first().textContent()

    try {
      if (await switchLabel.isVisible()) {
        // Click the label element (not the input which is visually hidden)
        await switchLabel.click()

        // Wait for the confirmation dialog to appear
        await page.waitForSelector('section[role="alertdialog"]', { timeout: 5000 })

        // Click the confirm button in the dialog
        const confirmButton = page.getByRole('button', { name: /confirm/i }).last()
        await confirmButton.click()

        // Wait for the API response after confirmation
        // await page.waitForResponse((response) => response.status() === 200, {
        //   timeout: 15000,
        // })

        // Wait for the toast notification to appear
        await page.waitForSelector('.chakra-toast', { timeout: 10000 })

        // Wait a moment for the UI to update
        await page.waitForTimeout(2000)

        // Get the updated status
        const newStatus = await page.locator('span.chakra-badge').first().textContent()

        // Assert new status is different from the initial status
        expect(newStatus).not.toEqual(initialStatus)
      } else {
        throw new Error('Could not toggle tool availability')
      }
    } catch (e) {
      throw e
    }
  })
})

/**
 * Navigate to a tool's detail page by selecting the first tool card
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when navigation is complete
 */
async function navigateToToolDetail(page: Page): Promise<void> {
  // Navigate to the tools list
  await page.goto('/tools')

  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(5000)

  try {
    // First approach: Try to find and click on elements containing "ToolTest" text
    const toolTestElements = page.getByText('ToolTest', { exact: false })

    // Check if we found any elements with "ToolTest" text
    const count = await toolTestElements.count()

    if (count > 0) {
      // Click the first element containing "ToolTest"
      await toolTestElements.first().click()
    } else {
      throw new Error('No tool card found')
    }

    // Wait for the tool detail page to load
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)

    // Verify we're on a tool detail page by checking the URL pattern
    await expect(page).toHaveURL(/\/tools\/\d+$/, { timeout: 10000 })
  } catch (error) {
    throw error
  }
}

const gotoAddToolPage = async (page: Page) => {
  // First navigate to the tools list page
  await page.goto(ROUTES.TOOLS.LIST)
  await page.waitForLoadState('networkidle')

  // Click on the "Add Tool" button or link instead of direct navigation
  // For some reason it doesn't work accessing directly from the route
  const addToolButton = page.locator(`a[href="${ROUTES.TOOLS.NEW}"], button:has-text("Add")`).first()
  await addToolButton.click()

  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(5000)

  // Wait for the form to be fully loaded - try multiple possible selectors
  await page.waitForSelector('button[type="submit"], button:has-text("Create"), input[name="title"]', {
    timeout: 15000,
  })
}
