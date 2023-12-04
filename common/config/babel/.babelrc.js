const plugins = [];

const featureDefinitions = require('./features');

process.env['COMMUNICATION_REACT_FLAVOR'] !== 'beta' &&
  plugins.push([
    '../../common/scripts/babel-conditional-preprocess',
    {
      ...featureDefinitions,
      betaReleaseMode: process.env['COMMUNICATION_REACT_FLAVOR'] === 'beta-release',
    }
  ]);

plugins.push([
  '@babel/plugin-syntax-typescript',
  {
    isTSX: true
  }
]);

module.exports = { plugins, ignore: ["**/*.d.ts"] };
