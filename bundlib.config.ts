import { BundlibConfig as Config } from 'bundlib';

const config: Config = {
  interop: true,
  esModule: 'main',
  min: ['browser', 'module'],
  project: 'tsconfig-build.json',
};

export default config;
