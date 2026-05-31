import type { Config } from 'jest'

const config: Config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
    transform: {
        '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: './tsconfig.jest.json' }],
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/jest.setup.ts'],
}

export default config
