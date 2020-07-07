module.exports = {
  preset: "jest-puppeteer",
  globals: {
    URL: "http://localhost:3000"
  },
  moduleDirectories: [
    "node_modules", "..\\src", "src"
  ],
  testMatch: ["**/specs/*.js"],
  transform: {
    "\\.js$": "react-scripts/config/jest/babelTransform"
  },
  setupFilesAfterEnv: ['./setupTestFramework.js'],
  verbose: true
};