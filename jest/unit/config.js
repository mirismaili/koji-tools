'use strict'

module.exports = {
  rootDir: process.cwd(),
  testEnvironment: './jest/KojiEnvironment.js',
  moduleFileExtensions: ['js', 'ts'],
  testRegex: '(\\.|/)(test|spec)\\.[jt]s?$',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './tools/readDirectory.js': {
      branches: 50,
      functions: 95,
      lines: 75,
      statements: 70,
    },
  },
}
