module.exports = {
    testEnvironment: 'node',
    //transform: {}, // Avoid ESModules conflicts
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
    transformIgnorePatterns: ["/node_modules/"],
};