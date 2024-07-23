import { BundlibConfig as Config } from 'bundlib';

const config: Config = {
  interop: true,
  esModule: 'main',
  min: 'browser',
  project: 'tsconfig-build.json',
};

export default config;
