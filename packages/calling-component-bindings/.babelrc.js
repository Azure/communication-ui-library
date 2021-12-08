const plugins = [];
process.env['FLAVOR'] === 'public' &&
  plugins.push([
    '../../common/scripts/babel-conditional-preprocess',
    { annotations: [{ match: '@conditional-compile(beta)' }] }
  ]);

plugins.push([
  '@babel/plugin-syntax-typescript',
  {
    isTSX: true
  }
]);

module.exports = { plugins };
