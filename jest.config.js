/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/src/analyze_version/__tests__/**/*.ts",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/clientRepos/"
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/clientRepos/"
  ],
};