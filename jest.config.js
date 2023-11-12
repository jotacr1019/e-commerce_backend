module.exports = {
    testEnvironment: "node",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testMatch: ["**/*.test.ts"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    // globals: {
    //     "ts-jest": {
    //         tsconfig: "tsconfig.json",
    //     },
    // },
};