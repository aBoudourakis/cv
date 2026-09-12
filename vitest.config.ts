import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Separate from vite.config.ts because that file's dev server config (custom
// host/HTTPS cert) has no bearing on running tests, and vitest's own
// `test` option isn't part of Vite's own config type.
export default defineConfig({
	plugins: [react()],

	resolve: {
		alias: {
			src: path.resolve(import.meta.dirname, './src'),
		},
	},

	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		css: true,
	},
})
