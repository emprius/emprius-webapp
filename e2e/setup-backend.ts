import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import axios from 'axios'

const BACKEND_REPO = 'https://github.com/emprius/emprius-app-backend.git'
const BACKEND_DIR = join(__dirname, '../backend-for-tests')
const BACKEND_API_URL = process.env.TEST_API_URL || 'http://localhost:3333'
const MAX_RETRIES = 30
const RETRY_INTERVAL = 2000 // 2 seconds

/**
 * Clone the backend repository if it doesn't exist
 */
export async function cloneBackendRepo() {
  if (!existsSync(BACKEND_DIR)) {
    console.log('Cloning backend repository...')
    mkdirSync(BACKEND_DIR, { recursive: true })
    execSync(`git clone ${BACKEND_REPO} ${BACKEND_DIR}`, { stdio: 'inherit' })
  } else {
    console.log('Backend repository already exists, pulling latest changes...')
    execSync(`cd ${BACKEND_DIR} && git pull`, { stdio: 'inherit' })
  }
}

/**
 * Start the docker compose services
 */
export async function startBackend() {
  console.log('Starting backend services...')
  execSync(`cd ${BACKEND_DIR} && docker compose up -d`, { stdio: 'inherit' })
}

/**
 * Wait for the backend to be ready
 */
export async function waitForBackend() {
  console.log('Waiting for backend to be ready...')

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/ping`)
      if (response.status === 200) {
        console.log('Backend is ready!')
        return true
      }
    } catch (error) {
      console.log(`Backend not ready yet, retrying in ${RETRY_INTERVAL / 1000} seconds...`)
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL))
  }

  throw new Error(`Backend failed to start after ${(MAX_RETRIES * RETRY_INTERVAL) / 1000} seconds`)
}

/**
 * Stop the docker compose services
 */
export async function stopBackend() {
  console.log('Stopping backend services...')
  execSync(`cd ${BACKEND_DIR} && docker compose down`, { stdio: 'inherit' })
}

/**
 * Setup the backend for tests
 */
export async function setupBackend() {
  await cloneBackendRepo()
  await startBackend()
  await waitForBackend()
}

/**
 * Teardown the backend after tests
 */
export async function teardownBackend() {
  await stopBackend()
}

// If this script is run directly
if (require.main === module) {
  ;(async () => {
    try {
      await setupBackend()
      console.log('Backend setup complete!')
    } catch (error) {
      console.error('Backend setup failed:', error)
      process.exit(1)
    }
  })()
}
