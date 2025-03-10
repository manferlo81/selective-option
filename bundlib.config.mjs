import { config } from 'bundlib'

export default config({
  interop: true,
  esModule: 'main',
  min: ['browser', 'module'],
  project: 'tsconfig-build.json',
})
