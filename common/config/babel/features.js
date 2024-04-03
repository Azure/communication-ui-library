module.exports = {
  // A list of features recognized by the conditional compilation preprocessing plugin.
  // "demo" is a special feature, used for demo purposes. For this feature,
  // The plugin removes any AST node that is preceded by a comment that contains the tag:
  // @conditional-compile-remove(demo)
  "features": [
    "call-readiness",
    // Flag to add API only available in beta calling SDK to mocks and internal types.
    // This feature should be stabilized whenever calling SDK is stabilized.
    "calling-beta-sdk",
    // Flag to add API only available in beta chat SDK to mocks and internal types.
    // This feature should be stabilized whenever chat SDK is stabilized.
    "chat-beta-sdk",
    // Flag to add API only available in the communication-common beta v3
    "communication-common-beta-v3",
    // Participant pane in the `ChatComposite`.
    "chat-composite-participant-pane",
    // Close captions feature
    "close-captions",
    // props to allow Contoso to overwrite timestamp format for chat messages, one in locale and one in message thread component
    "date-time-customization",
    // Demo feature. Used in live-documentation of conditional compilation.
    // Do not use in production code.
    "demo",
    // dialpad
    "dialpad",
    // Data loss prevention feature
    "data-loss-prevention",
    // Ability to download files attachments in message thread.
    "attachment-download",
    // Ability to upload files attachments in message thread.
    "attachment-upload",
    // Mention feature
    "mention",
    // 1 to N Calling feature.
    "one-to-n-calling",
    // PSTN calls 
    "PSTN-calls",
    // Adhoc calls to a Teams user.
    "teams-adhoc-call",
    // Joining calls using teams token
    "teams-identity-support",
    "unsupported-browser",
    // Support Calling SDK isReceiving flag, shows a loading spinner on the video tile when isAvailable is true but isReceiving is false
    "video-stream-is-receiving-flag",
    // Feature to show the total number of participants in a call (currently in beta in calling SDK, hence this must be conditionally compiled)
    "total-participant-count",
    // feature for tracking environment info API different than unsupported browser. stable use of environment info affects other components possibly sooner
    "calling-environment-info",
    // a demo feature flag for those beta feature not ready for beta release
    "in-progress-beta-feature-demo",
    // Feature for call transfer
    "call-transfer",
    // Feature for large Gallery layout
    "large-gallery",
    // feature for positioning the overflowGallery at the top of the screen in the composite
    "overflow-top-composite",
    // feature for gallery layout in the composite 
    "gallery-layout-composite",
    // conditional-compile for new signaling beta
    "signaling-beta",
    // feature for hiding attendee name in the teams meeting
    "hide-attendee-name",
    // custom branding for the composites
    "custom-branding",
    // Feature for end of call survey
    'end-of-call-survey',
    // Feature for the DTMF dialer for Teams voice apps
    'dtmf-dialer',
    // Feature for PPT Live for teams meeting
    'ppt-live',
    // Feature for meeting reactions
    'reaction',
    // Feature for Rich Text Editor (RTE) support
    'rich-text-editor',
    // Feature for spotlight
    'spotlight',
    // Feature for tracking beta start call identifier
    'start-call-beta',
    // Join meeting with meetingId and passcode
    'meeting-id',
    // Image overlay theme
    'image-overlay-theme',
     // Close captions feature for ACS calls
     "acs-close-captions",
    // Feature for local recording notification for teams meetings
    'local-recording-notification',
    // Feature for end call options 
    'end-call-options'
  ],
  // A list of in progress beta feature.
  // These features are still beta feature but "in progress"
  // causing a build failure, but they are ignored by the preprocessing step.
  "inProgressFeatures": [
    // Demo feature. Used in live-documentation of conditional compilation.
    // Do not use in production code.
    "in-progress-beta-feature-demo",
    // Feature for custom video gallery layouts
    // Feature for large gallery layout DO NOT REMOVE UNTIL SDK SUPPORTS 49 VIDEO STREAMS
    "large-gallery",
    // feature for positioning the overflowGallery at the top of the screen in the composite
    "overflow-top-composite",
    // feature for gallery layout in the composite 
    "gallery-layout-composite",
    // feature for hiding attendee name in the teams meeting
    "hide-attendee-name",
    // Feature for meeting reactions
    'reaction',
    // Feature for PPT Live for teams meeting
    'ppt-live',
    // Feature for Rich Text Editor (RTE) support
    'rich-text-editor',
    // Feature for spotlight
    'spotlight',
    // Join meeting with meetingId and passcode
    'meeting-id',
    // Close captions feature for ACS calls
    "acs-close-captions",
  ],
  // A list of stabilized features.
  // These features can be listed in the conditional compilation directives without
  // causing a build failure, but they are ignored by the preprocessing step.
  "stabilizedFeatures": [
    // Demo feature. Used in live-documentation of conditional compilation.
    // Do not use in production code.
    "stabilizedDemo",
    // Feature for capabilities
    "capabilities",
    // Closed captions
    "close-captions",
    // Feature for the DTMF dialer for Teams voice apps
    "dtmf-dialer",
    // Feature for call transfer
    "call-transfer",
    // custom branding for the composites
    "custom-branding",
    // Support Calling SDK isReceiving flag, shows a loading spinner on the video tile when isAvailable is true but isReceiving is false
    "video-stream-is-receiving-flag",
  ]
}
