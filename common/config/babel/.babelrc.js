const plugins = [];
process.env['COMMUNICATION_REACT_FLAVOR'] === 'stable' &&
  plugins.push([
    '../../common/scripts/babel-conditional-preprocess',
    {
      // Deprecated: Use `features` instead.
      match: '@conditional-compile-remove-from(stable)',
      // A list of features recognized by the conditional compilation preprocessing plugin.
      // "demo" is a special feature, used for demo purposes. For this feature,
      // The plugin removes any AST node that is preceded by a comment that contains with the tag:
      // @conditional-compile-remove(demo)
      features: [
        // Demo feature. Used in live-documentation of conditional compilation.
        // Do not use in production code.
        'demo',
      ],
     }
  ]);

plugins.push([
  '@babel/plugin-syntax-typescript',
  {
    isTSX: true
  }
]);

module.exports = { plugins };
