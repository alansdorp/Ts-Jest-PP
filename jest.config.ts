import type { Config } from '@jest/types'

const baseDir = '<rootDir>/src/app/server_app';
const baseTestDir = '<rootDir>/src/test';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        // `${baseDir}/**/*.ts`,
        // '<rootDir>/src/app/pass_checker/*.ts',
        '<rootDir>/src/app/exersice/ej2.ts'
    ],
    testMatch:[
        // `${baseTestDir}/server_app/**/*test.ts`,
        // `${baseTestDir}/server_app2/**/*test.ts`,
        // `${baseTestDir}/Utils.test.ts`
        // '<rootDir>/src/test/exersice/*test.ts',
        `${baseTestDir}/**/*test.ts`,
        // `${baseTestDir}/**/*test.ts`,
        // `${baseTestDir}/server_app2/**/*test.ts`,
        // `${baseTestDir}/Utils.test.ts`
    ],
    // watch: true
}

export default config;