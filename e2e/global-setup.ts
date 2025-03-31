import { FullConfig } from '@playwright/test'
import { setupBackend } from './setup-backend'
import axios from 'axios'
import { DEFAULT_TEST_USER, invitationToken, registerDefaultUser } from './utils/auth'

/**
 * Global setup function that runs before all tests
 */
async function globalSetup(config: FullConfig) {
  // Log the API URL being used for tests
  console.log('Using API URL:', process.env.TEST_API_URL || 'http://localhost:3333')

  // If RUN_BACKEND is true set up the backend
  if (process.env.RUN_BACKEND === 'true') {
    await setupBackend()
  }

  // Register the default test user
  await registerDefaultUser()
}

export default globalSetup
