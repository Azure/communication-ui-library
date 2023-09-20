const plugins = [];
process.env['COMMUNICATION_REACT_FLAVOR'] !== 'beta' &&
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
        // Flag to add API only available in beta chat SDK to mocks and internal types.
        // This feature should be stabilized whenever chat SDK is stabilized.
        'chat-beta-sdk',
        // Flag to add API only available in the communication-common beta v3
        'communication-common-beta-v3',
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
        // Chat teams interop to display images and file attachments in chat messages
        'teams-inline-images-and-file-sharing',
        'unsupported-browser',
        // Support Calling SDK isReceiving flag, shows a loading spinner on the video tile when isAvailable is true but isReceiving is false
        'video-stream-is-receiving-flag',
        // Feature to show the total number of participants in a call (currently in beta in calling SDK, hence this must be conditionally compiled)
        'total-participant-count',
        // feature for tracking environment info API different than unsupported browser. stable use of environment info affects other components possibly sooner
        'calling-environment-info',
        // feature for vertical gallery layouts in VideoGallery
        'vertical-gallery',
        // Feature for updates needed for Click to Call (C2C) scenarios
        'click-to-call',
        // a demo feature flag for those beta feature not ready for beta release
        'in-progress-beta-feature-demo',
        // Feature for call transfer
        'call-transfer',
        // Optimal Video Count
        'optimal-video-count',
        // Feature for capabilities
        'capabilities',
        // Feature for custom video gallery layouts
        'gallery-layouts',
        // Feature image gallery
        'image-gallery',
        // Feature for end of call survey
        'end-of-call-survey'
      ],      
      // A list of in progress beta feature.
      // These features are still beta feature but "in progress"
      // causing a build failure, but they are ignored by the preprocessing step.
      inProgressFeatures: [
        // Demo feature. Used in live-documentation of conditional compilation.
        // Do not use in production code.
        'in-progress-beta-feature-demo',
        // Feature for custom video gallery layouts
        'gallery-layouts',
        // Feature for end of call survey
        'end-of-call-survey'
      ],
      betaReleaseMode: process.env['COMMUNICATION_REACT_FLAVOR'] === 'beta-release',
      // A list of stabilized features.
      // These features can be listed in the conditional compilation directives without
      // causing a build failure, but they are ignored by the preprocessing step.
      stabilizedFeatures: [
        // Demo feature. Used in live-documentation of conditional compilation.
        // Do not use in production code.
        'stabilizedDemo',
        // feature for blurred background and replace background effects
        'video-background-effects',
        // Pinned Participants
        'pinned-participants',
        // Feature for capabilities
        'capabilities',
         // Closed captions
        'close-captions',
        // Optimal Video Count
        'optimal-video-count',
        // raise hands feature
        'raise-hand'
      ]
    }
  ]);

plugins.push([
  '@babel/plugin-syntax-typescript',
  {
    isTSX: true
  }
]);

module.exports = { plugins, ignore: ["**/*.d.ts"] };
