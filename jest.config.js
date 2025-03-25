/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    coverageProvider: 'v8',
    transform: {
        '^.+.ts?$': ['ts-jest', {}],
    },
};
