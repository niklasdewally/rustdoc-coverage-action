module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  "transformIgnorePatterns": [
    "<rootDir>/node_modules/(?!markdown-table/)"
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true
}