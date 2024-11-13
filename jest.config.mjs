const { COVERAGE } = process.env;

/** @type { import("jest").Config } */
const config = {
  cacheDirectory: 'node_modules/.cache/jest',
  preset: 'ts-jest',

  collectCoverage: COVERAGE !== 'SKIP',
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: COVERAGE === 'CI'
    ? ['json', 'clover', 'cobertura']
    : ['html', 'text'],

  testMatch: [
    '**/__test__/**/*.test.ts',
  ],

  verbose: true,
};

export default config;
