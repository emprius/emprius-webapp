import { test, expect } from '@playwright/test'
import { DEFAULT_TEST_USER } from '../utils/auth'
import axios from 'axios'
import { BACKEND_API_URL } from '../setup-backend'

/**
 * This test verifies that the default user exists and can log in
 * The user should already be registered in the global-setup.ts
 */
test('verify default user can login via API', async () => {
  // Prepare the login data
  const loginData = {
    email: DEFAULT_TEST_USER.email,
    password: DEFAULT_TEST_USER.password,
  }

  try {
    // Make a direct API call to the /login endpoint using axios
    const response = await axios.post(`${BACKEND_API_URL}/login`, loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Check if the login was successful
    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('data.token')
    console.log('Default user profile verified')
  } catch (error) {
    console.error('Error verifying default user:', error.message)
    throw error
  }
})
