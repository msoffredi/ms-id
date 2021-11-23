// eslint-disable-next-line no-undef
module.exports = {
    preset: 'ts-jest',
    modulePathIgnorePatterns: [
        '<rootDir>/.aws-sam',
        '<rootDir>/__tests__/utils',
        '<rootDir>/__tests__/events',
        '<rootDir>/__tests__/postman',
    ],
    clearMocks: true,
    setupFilesAfterEnv: ['./__tests__/utils/setup.ts'],
    collectCoverageFrom: ['src/**/*.{ts,js}'],
};
