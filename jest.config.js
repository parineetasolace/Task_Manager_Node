export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testTimeout: 10000,
};