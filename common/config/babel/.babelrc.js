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
        'call-readiness',
        // Flag to add API only available in beta calling SDK to mocks and internal types.
        // This feature should be stabilized whenever calling SDK is stabilized.
        'calling-beta-sdk',
        // Participant pane in the `ChatComposite`.
        'chat-composite-participant-pane',
        // Close captions feature
        'close-captions',
        // API for injecting custom buttons in he control bar for
        // `CallComposite` and `CallWithChatComposite`.
        'control-bar-button-injection',
        // props to allow Contoso to overwrite timestamp format for chat messages, one in locale and one in message thread component
        'date-time-customization',
        // Demo feature. Used in live-documentation of conditional compilation.
        // Do not use in production code.
        'demo',
        // dialpad
        'dialpad',
        // Data loss prevention feature
        'data-loss-prevention',
        // Ability to upload/download files in message thread.
        'file-sharing',
        // Mention feature
        'mention',
        // feature for enabling new call control bar in CallComposite
        'new-call-control-bar',
        // 1 to N Calling feature.
        'one-to-n-calling',
        // PSTN calls 
        'PSTN-calls',
        // rooms
        'rooms',
        // Adhoc calls to a Teams user.
        'teams-adhoc-call',
        // Joining calls using teams token
        'teams-identity-support',
        // Chat teams interop to display images in chat messages
        'teams-inline-images',
        'unsupported-browser',
        // Support Calling SDK isReceiving flag, shows a loading spinner on the video tile when isAvailable is true but isReceiving is false
        'video-stream-is-receiving-flag',
        // Pinned Participants
        'pinned-participants',
        // Feature to show the total number of participants in a call (currently in beta in calling SDK, hence this must be conditionally compiled)
        'total-participant-count',
        // feature for tracking environment info API different than unsupported browser. stable use of environment info affects other components possibly sooner
        'calling-environment-info',
        // feature for blurred background and replace background effects
        'video-background-effects',
        // feature for vertical gallery layouts in VideoGallery
        'vertical-gallery',
        // feature for incoming call at the composite level
        'incoming-call-composites',
        // Feature for updates needed for Click to Call (C2C) scenarios
        'click-to-call'
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
