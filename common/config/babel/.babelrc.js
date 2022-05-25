const plugins = [];
process.env['COMMUNICATION_REACT_FLAVOR'] === 'stable' &&
  plugins.push([
    '../../common/scripts/babel-conditional-preprocess',
    {
      // A list of features recognized by the conditional compilation preprocessing plugin.
      // "demo" is a special feature, used for demo purposes. For this feature,
      // The plugin removes any AST node that is preceded by a comment that contains the tag:
      // @conditional-compile-remove(demo)
      features: [
        // Flag to add API only available in beta calling SDK to mocks and internal types.
        // This feature should be stabilized whenever calling SDK is stabilized.
        'calling-1.4.3-beta.1',
        // Participant pane in the `ChatComposite`.
        'chat-composite-participant-pane',
        // API for injecting custom buttons in he control bar for
        // `CallComposite` and `CallWithChatComposite`.
        'control-bar-button-injection',
        // Demo feature. Used in live-documentation of conditional compilation.
        // Do not use in production code.
        'demo',
        // Ability to upload/download files in message thread.
        'file-sharing',
        // Adhoc calls to a Teams user.
        'teams-adhoc-call',
        // PSTN calls 
        'PSTN-calls',
        // props to allow Contoso to overwrite timestamp format for chat messages, one in locale and one in message thread component
        'date-time-customization'
      ],
      // A list of stabilized features.
      // These features can be listed in the conditional compilation directives without
      // causing a build failure, but they are ignored by the preprocessing step.
      stabilizedFeatures: [
        // Demo feature. Used in live-documentation of conditional compilation.
        // Do not use in production code.
        'stabilizedDemo',
      ]
     }
  ]);

plugins.push([
  '@babel/plugin-syntax-typescript',
  {
    isTSX: true
  }
]);

module.exports = { plugins };
