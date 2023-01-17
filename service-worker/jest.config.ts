module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['src/'],
  testMatch: ['**/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  setupFiles: [`<rootDir>/test-setup.ts`, 'fake-indexeddb/auto'],
  moduleDirectories: ['node_modules'],
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  timers: 'fake',
  reporters: ['default', 'jest-junit'],
  globals: {
    'ts-jest': {
      tsconfig: {
        allowJs: true,
      },
    },
  },
};
