/// A list of features recognized by the conditional compilation preprocessing plugin.
///
/// alpha - Features that are in development and not yet ready for general use.
///         These features conditional-compiled out of beta and stable npm packages.
/// beta - Features that are in development and are ready for public preview.
///        These features are conditional-compiled out of stable npm packages.
/// stable - Features that are ready for general use. These features are included in all releases.
///
module.exports = {
  alpha: [
    // Feature for custom video gallery layouts
    // Feature for large gallery layout DO NOT REMOVE UNTIL SDK SUPPORTS 49 VIDEO STREAMS
    "large-gallery",
    // feature for positioning the overflowGallery at the top of the screen in the composite
    "overflow-top-composite",
    // feature for gallery layout in the composite
    "gallery-layout-composite",
    // feature for hiding attendee name in the teams meeting
    "hide-attendee-name",
    // Demo feature. Used in live-documentation of conditional compilation. Do not use in production code.
    "in-progress-beta-feature-demo",
    // feature for adding JS helpers to the UI library API
    "composite-js-helpers",
    // Feature for remote UFD
    "remote-ufd",
    // Feature for showing dtmp dialer by default
    "dtmf-dialer-on-by-default",
    // Deep Noise Suppression feature
    "DNS"
  ],
  beta: [
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
    // props to allow Contoso to overwrite timestamp format for chat messages, one in locale and one in message thread component
    "date-time-customization",
    // Demo feature. Used in live-documentation of conditional compilation.
    // Do not use in production code.
    "demo",
    // dialpad
    "dialpad",
    // Data loss prevention feature
    "data-loss-prevention",
    // Mention feature
    "mention",
    // 1 to N Calling feature.
    "one-to-n-calling",
    // PSTN calls 
    "PSTN-calls",
    // Adhoc calls to a Teams user.
    "teams-adhoc-call",
    // Beta feature for joining calls using teams token
    "teams-identity-support-beta",
    // Block joining calls if the user is on an unsupported browser
    "unsupported-browser",
    // Feature to show the total number of participants in a call (currently in beta in calling SDK, hence this must be conditionally compiled)
    "total-participant-count",
    // feature for tracking environment info API different than unsupported browser. stable use of environment info affects other components possibly sooner
    "calling-environment-info",
    // conditional-compile for new signaling beta
    "signaling-beta",
    // Feature for tracking beta start call identifier
    'start-call-beta',
    // Image overlay theme
    'image-overlay-theme',
    // Feature for local recording notification for teams meetings
    'local-recording-notification',
    // Close captions feature for ACS calls
    "acs-close-captions",
    // Feature for Rich Text Editor (RTE) support
    'rich-text-editor',
    // Feature for Rich Text Editor (RTE) composite support
    "rich-text-editor-composite-support",
    // Feature for Rich Text Editor (RTE) image upload support
    "rich-text-editor-image-upload",
    // Feature to support file sharing in ACS chats
    "file-sharing-acs",
    // Soft Mute feature for ACS calls and Interop calls
    "soft-mute",
    // feature for breakout rooms
    "breakout-rooms"
  ],
  stable: [
    // Demo feature. Used in live-documentation of conditional compilation.
    // Do not use in production code.
    "stabilizedDemo",
    // Joining calls using teams token
    "teams-identity-support",
    // feature for hiding attendee name in the teams meeting
    "hide-attendee-name",
    // Feature for end call options 
    'end-call-options',
    // Feature to support file sharing in Teams interoperability chats
    "file-sharing-teams-interop",
    // Get join conference information
    'teams-meeting-conference'
  ]
}
