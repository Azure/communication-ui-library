const plugins = [];
process.env['COMMUNICATION_REACT_FLAVOR'] === 'stable' &&
  plugins.push([
    '../../common/scripts/babel-conditional-preprocess',
    { match: '@conditional-compile-remove-from(stable)' }
  ]);

plugins.push([
  '@babel/plugin-syntax-typescript',
  {
    isTSX: true
  }
]);

module.exports = { plugins };
