// jest.config.js
process.env.NODE_ENV = 'test';
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup-env.ts'],
  testMatch: ['**/tests/**/*.test.ts'],
  clearMocks: true,
};