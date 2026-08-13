import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
	server: {
		host: 'dev.athos-cv.com',
		port: 443,
		strictPort: true,

		allowedHosts: [
			'dev.athos-cv.com',
		],

		https: {
			key: fs.readFileSync(
				path.resolve(__dirname, '.cert/dev.athos-cv.com-key.pem')
			),
			cert: fs.readFileSync(
				path.resolve(__dirname, '.cert/dev.athos-cv.com.pem')
			),
		},
	},
})
