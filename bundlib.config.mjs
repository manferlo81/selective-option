import { config } from 'bundlib'

export default config({
  interop: true,
  esModule: true,
  min: ['browser', 'module'],
  project: './tsconfig-build.json',
})
