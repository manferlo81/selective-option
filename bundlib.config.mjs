import { defineConfig } from 'bundlib'

export default defineConfig({
  interop: true,
  esModule: true,
  min: ['browser', 'module'],
  project: './tsconfig.build.json',
})
