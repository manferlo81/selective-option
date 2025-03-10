const { COVERAGE } = process.env

/** @type { import("ts-jest").JestConfigWithTsJest } */
const config = {
  preset: 'ts-jest',

  collectCoverage: COVERAGE !== 'SKIP',
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: COVERAGE === 'CI'
    ? ['text', 'json', 'clover', 'cobertura']
    : ['text', 'html'],

  testMatch: [
    '**/__test__/**/*.test.ts',
  ],

  cacheDirectory: 'node_modules/.cache/jest',
  verbose: true,
}

export default config
