import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import importX from 'eslint-plugin-import-x'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'

const basePath = fileURLToPath(new URL('.', import.meta.url))
const featureZones = readdirSync(new URL('./src/features/', import.meta.url), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map(({ name }) => ({
    target: `./src/features/${name}`,
    from: './src/features',
    except: [`./${name}`],
    message: 'Move shared code outside src/features instead of importing from another feature.',
  }))

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'import-x': importX,
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: fileURLToPath(new URL('./tsconfig.app.json', import.meta.url)),
        }),
      ],
    },
    rules: {
      'react-refresh/only-export-components': 'off',
      'import-x/no-restricted-paths': ['error', { basePath, zones: featureZones }],
    },
  },
])
