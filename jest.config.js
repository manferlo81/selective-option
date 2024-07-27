module.exports = {

  testEnvironment: 'node',
  cacheDirectory: 'node_modules/.cache/jest',

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    process.env.CI ? 'json' : 'html',
    'text',
  ],

  testMatch: [
    '**/__test__/**/*.test.ts',
  ],

  transform: {
    '\\.ts$': 'ts-jest',
  },

  verbose: true,

};
