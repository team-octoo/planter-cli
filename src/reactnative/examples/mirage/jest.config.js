const jestPreset = require("@testing-library/react-native/jest-preset");

module.exports = {
  testEnvironment: "jsdom",
  preset: "react-native",
  setupFiles: [...jestPreset.setupFiles],
  setupFilesAfterEnv: ["./jest.setup.js"],
};
