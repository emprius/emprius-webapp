# End-to-End Testing with Playwright

This directory contains end-to-end tests for the Emprius web application using Playwright.

## Setup

The tests are configured to run against a local development server and can optionally use a dockerized backend.

### Prerequisites

- Node.js 20+
- Yarn
- Docker and Docker Compose (for backend tests)
- Git

### Installation

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Without Backend (Using Remote API)

To run tests without the local backend (using the production API):

```bash
yarn test:e2e
```

This will run the tests against the production API (https://api.emprius.cat).

### With Local Backend

To run tests with the dockerized backend:

```bash
yarn test:e2e:with-backend
```

This will:
1. Clone the backend repository if it doesn't exist
2. Start the backend services using Docker Compose
3. Wait for the backend to be ready
4. Run the tests against the local backend (http://localhost:3333) without showing the HTML report
5. Tear down the backend services

Note: This command uses the `PW_TEST_HTML_REPORT_OPEN='never'` setting to prevent the HTML report from being automatically shown after the tests run.

### Environment Variables

#### API URL Configuration

The API URL can be configured using the `TEST_API_URL` environment variable:

#### On Linux/macOS:

```bash
# Run tests against a custom API
TEST_API_URL=https://staging-api.emprius.cat yarn test:e2e

# Or set the variable first, then run the command
export TEST_API_URL=https://staging-api.emprius.cat
yarn test:e2e
```

#### On Windows (Command Prompt):

```cmd
# Set the variable first, then run the command
set TEST_API_URL=https://staging-api.emprius.cat
yarn test:e2e
```

#### On Windows (PowerShell):

```powershell
# Set the variable first, then run the command
$env:TEST_API_URL = "https://staging-api.emprius.cat"
yarn test:e2e
```

By default:
- `yarn test:e2e` uses https://api.emprius.cat
- `yarn test:e2e:with-backend` uses http://localhost:3333

You can override these defaults by setting the `TEST_API_URL` environment variable as shown above.

#### Registration Token

For the registration test to work properly, you may need to provide a valid invitation token:

```bash
# On Linux/macOS
REGISTER_TOKEN=your-valid-token yarn test:e2e

# On Windows (Command Prompt)
set REGISTER_TOKEN=your-valid-token
yarn test:e2e

# On Windows (PowerShell)
$env:REGISTER_TOKEN = "your-valid-token"
yarn test:e2e
```

If not provided, the test will use a default value of 'test', which may not work with your backend.

### UI Mode

To run tests in UI mode (for debugging):

```bash
yarn test:e2e:ui
```

### Setup Backend Only

If you want to just set up the backend without running tests:

```bash
yarn test:e2e:setup-backend
```

## Test Structure

- `e2e/tests/` - Contains all test files
  - `e2e/tests/example.spec.ts` - Basic example tests
  - `e2e/tests/register.spec.ts` - User registration tests
- `e2e/playwright.config.ts` - Playwright configuration
- `e2e/setup-backend.ts` - Script to set up the backend
- `e2e/global-setup.ts` - Global setup for Playwright
- `e2e/global-teardown.ts` - Global teardown for Playwright

## Writing Tests

Tests are written using Playwright's test framework. Here's a basic example:

```typescript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Emprius/);
});
```

### Available Tests

#### Basic Tests (example.spec.ts)
- Homepage loads correctly
- Login page is accessible

#### User Registration Tests (register.spec.ts)
- Successfully register a new user with valid data
- Show validation errors for invalid inputs

For more information, see the [Playwright documentation](https://playwright.dev/docs/intro).

## CI/CD Integration

Tests are automatically run on GitHub Actions for every push to main/master/develop branches and for pull requests.

The workflow is defined in `.github/workflows/e2e-tests.yml`.
