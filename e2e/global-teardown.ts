import { FullConfig } from '@playwright/test'
import { teardownBackend } from './setup-backend'

/**
 * Global teardown function that runs after all tests
 */
async function globalTeardown(config: FullConfig) {
  // Tear down the backend if we're not in CI or if we're in CI and need to run the backend
  if (process.env.RUN_BACKEND === 'true') {
    await teardownBackend()
  }
}

export default globalTeardown
