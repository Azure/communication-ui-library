const plugins = [];
process.env['FLAVOR'] === 'public' &&
  plugins.push([
    '../../common/scripts/babel-conditional-preprocess',
    { identifiers: [{ start: 'beta:start', end: 'beta:end' }] }
  ]);

plugins.push([
  '@babel/plugin-syntax-typescript',
  {
    isTSX: true
  }
]);

module.exports = { plugins };
