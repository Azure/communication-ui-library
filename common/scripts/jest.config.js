
module.exports = {
  transform: {
      '^.+\\.jsx?$': ['babel-jest', { configFile: './scripts-tests-setup/babel-config-jest.js' }],
      '^.+\\.mjs$': ['babel-jest', { configFile: './scripts-tests-setup/babel-config-jest.js' }],
  },
};
