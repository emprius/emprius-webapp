import react from '@vitejs/plugin-react'
import {defineConfig, loadEnv} from 'vite'
import {createHtmlPlugin} from 'vite-plugin-html'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import {execSync} from 'child_process'

// https://vitejs.dev/config/
const viteconfig = ({ mode }) => {
  // load env variables from .env files
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  let environment = process.env.ENVIRONMENT
  if (!environment) {
    environment = 'dev'
  }

  const outDir = process.env.BUILD_PATH
  const base = process.env.BASE_URL || '/'

  const commit = execSync('git rev-parse --short HEAD').toString()

  const title = process.env.APP_TITLE || 'Emprius App'

  let apiUrl = process.env.API_URL || 'https://app-api.emprius.cat'
  if (apiUrl.endsWith('/')) {
    apiUrl = apiUrl.slice(0, -1)
  }

  return defineConfig({
    base,
    build: {
      outDir,
    },
    define: {
      'import.meta.env.ENVIRONMENT': JSON.stringify(environment),
      'import.meta.env.title': JSON.stringify(title),
      'import.meta.env.API_URL': JSON.stringify(apiUrl),
    },
    plugins: [
      tsconfigPaths(),
      react(),
      svgr(),
      createHtmlPlugin({
        template: `index.html`,
        minify: {
          removeComments: false,
          collapseWhitespace: true,
        },
        inject: {
          data: {
            commit: commit.trim(),
            title,
          },
        },
      }),
    ],
  })
}

export default viteconfig
