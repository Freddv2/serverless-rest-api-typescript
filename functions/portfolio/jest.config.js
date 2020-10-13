// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: 'ts-jest',
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // An array of file extensions your modules use
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/test'],
  // The test environment that will be used for testing
  testEnvironment: "node",
  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  // A map from regular expressions to paths to transformers
  transform: {'^.+\\.tsx?$': 'ts-jest'},
};
