import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '@/domain/(.*)': '<rootDir>/src/domain/$1',
    '@/application/(.*)': '<rootDir>/src/application/$1',
    '@/infrastructure/(.*)': '<rootDir>/src/infrastructure/$1',
    '@/presentation/(.*)': '<rootDir>/src/presentation/$1',
  },
}

export default config
