import { FullConfig } from '@playwright/test'
import { setupBackend } from './setup-backend'

/**
 * Global setup function that runs before all tests
 */
async function globalSetup(config: FullConfig) {
  // Log the API URL being used for tests
  console.log('Using API URL:', process.env.TEST_API_URL || 'http://localhost:3333')
  
  // If RUN_BACKEND is true, set up the backend
  if (process.env.RUN_BACKEND === 'true') {
    await setupBackend()
  }
}

export default globalSetup
