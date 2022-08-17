// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Strings used by the {@link CallComposite} directly.
 *
 * This strings are in addition to those used by the components from the component library.
 *
 * @public
 */
export interface CallCompositeStrings {
  /**
   * Title of configuration page.
   */
  configurationPageTitle: string;
  /**
   * Optional 1-2 lines on the call details used on the configuration page.
   */
  configurationPageCallDetails?: string;
  /**
   * Text in button to start call in configuration page.
   */
  startCallButtonLabel: string;
  /**
   * Text in button to rejoin an ended call.
   */
  rejoinCallButtonLabel: string;
  /**
   * Placeholder text for local device settings dropdowns.
   */
  defaultPlaceHolder: string;
  /**
   * Label for camera dropdown.
   */
  cameraLabel: string;
  /**
   * Label for sound dropdown.
   */
  soundLabel: string;
  /**
   * Error shown when camera access is blocked by the browser.
   */
  cameraPermissionDenied: string;
  /**
   * Error shown when the camera is turned off.
   */
  cameraTurnedOff: string;
  /**
   * Error shown when microphone access is blocked by the browser.
   */
  microphonePermissionDenied: string;
  /**
   * Title text of the page shown to the user when joining a Teams meeting fails because meeting owner denied access.
   */
  failedToJoinTeamsMeetingReasonAccessDeniedTitle: string;
  /**
   * More details text of the page shown to the user when joining a Teams meeting fails because meeting owner denied access.
   */
  failedToJoinTeamsMeetingReasonAccessDeniedMoreDetails?: string;
  /**
   * Title text of the page shown to the user when joining a call fails due to a network problem.
   */
  failedToJoinCallDueToNoNetworkTitle: string;
  /**
   * More details text of the page shown to the user when joining a call fails due to a network problem.
   */
  failedToJoinCallDueToNoNetworkMoreDetails?: string;
  /**
   * Title text of the page shown to the user when they leave a call in the call composite.
   */
  leftCallTitle: string;
  /**
   * More details text of the page shown to the user when they leave a call in the call composite.
   */
  leftCallMoreDetails?: string;
  /**
   * Title text of the page shown to the user when they are removed from a call in the call composite.
   */
  removedFromCallTitle: string;
  /**
   * More details text of the page shown to the user when they are removed from a call in the call composite.
   */
  removedFromCallMoreDetails?: string;
  /**
   * Text shown to the user on the lobby screen when connecting to a call.
   */
  lobbyScreenConnectingToCallTitle: string;
  /**
   * Optional addition details shown to the user on the lobby screen when connection to a call.
   */
  lobbyScreenConnectingToCallMoreDetails?: string;
  /**
   * Text shown to the user on the lobby screen when waiting to be admitted to a call.
   */
  lobbyScreenWaitingToBeAdmittedTitle: string;
  /**
   * Optional additional details shown to the user on the lobby screen when waiting to be admitted to a call.
   */
  lobbyScreenWaitingToBeAdmittedMoreDetails?: string;
  /**
   * Message shown to the user when they are speaking while muted.
   */
  mutedMessage: string;
  /**
   * Text for link to MS privacy policy in Compliance Banner.
   */
  privacyPolicy: string;
  /**
   * Text for link to learn more about a specific subject.
   */
  learnMore: string;
  /**
   * Message to let user know the meeting is only being recorded (no transcription) in ComplianceBanner.
   */
  complianceBannerNowOnlyRecording: string;
  /**
   * Message to let user know the meeting is only being transcripted (no recording) in ComplianceBanner.
   */
  complianceBannerNowOnlyTranscription: string;
  /**
   * Message to let user know recording and transcription of the meeting are saved in ComplianceBanner.
   */
  complianceBannerRecordingAndTranscriptionSaved: string;
  /**
   * Message to let user know recording and transcription of the meeting have started in ComplianceBanner.
   */
  complianceBannerRecordingAndTranscriptionStarted: string;
  /**
   * Message to let user know recording and transcription of the meeting have stopped in ComplianceBanner.
   */
  complianceBannerRecordingAndTranscriptionStopped: string;
  /**
   * Message to let user know recording of the meeting is being saved in ComplianceBanner.
   */
  complianceBannerRecordingSaving: string;
  /**
   * Message to let user know recording of the meeting has started in ComplianceBanner.
   */
  complianceBannerRecordingStarted: string;
  /**
   * Message to let user know recording of the meeting has stopped in ComplianceBanner.
   */
  complianceBannerRecordingStopped: string;
  /**
   * Message to let user know they are giving consent to meeting being transcripted in ComplianceBanner.
   */
  complianceBannerTranscriptionConsent: string;
  /**
   * Message to let user know transcription of the meeting is being saved in ComplianceBanner.
   */
  complianceBannerTranscriptionSaving: string;
  /**
   * Message to let user know transcription of the meeting has started in ComplianceBanner.
   */
  complianceBannerTranscriptionStarted: string;
  /**
   * Message to let user know the transcription of the meeting has stopped in ComplianceBanner.
   */
  complianceBannerTranscriptionStopped: string;
  /**
   * Text for close button.
   */
  close: string;
  /**
   * Title text of the page shown to the user when there is intermittent network failure during a call.
   */
  networkReconnectTitle: string;
  /**
   * More details text of the page shown to the user when there is intermittent network failure during a call.
   */
  networkReconnectMoreDetails: string;
  /**
   * Tooltip text used to inform a user that toggling microphone in lobby is not supported.
   */
  microphoneToggleInLobbyNotAllowed: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Side pane People section Title.
   */
  peoplePaneTitle: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Aria label string for return to call back button
   */
  returnToCallButtonAriaLabel?: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Aria Description string for return to call button
   */
  returnToCallButtonAriaDescription?: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * control bar People button label
   */
  peopleButtonLabel: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * control bar Chat button label.
   */
  chatButtonLabel: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Label for SidePaneHeader dismiss button
   */
  dismissSidePaneButtonLabel?: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Side pane People section subheader.
   */
  peoplePaneSubTitle: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Label for button to copy invite link
   */
  copyInviteLinkButtonLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for button to open dialpad
   */
  openDialpadButtonLabel: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Label for menu item to remove participant
   */
  removeMenuLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for add people dropdown
   */
  peoplePaneAddPeopleButtonLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for button to start a call
   */
  dialpadStartCallButtonLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Title for dialpad Modal
   */
  dialpadModalTitle: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Aria Label for dialpad Modal
   */
  dialpadModalAriaLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Aria Label for dialpad Modal close button
   */
  dialpadCloseModalButtonAriaLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * label for more button in the Calling composite
   */
  moreButtonCallingLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Label for the resume call button on the hold pane
   */
  resumeCallButtonLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Aria label for the resume call button on the hold pane
   */
  resumeCallButtonAriaLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Label for the hold pane
   */
  holdScreenLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Placeholder text for dtmf dialpad
   */
  dtmfDialpadPlaceHolderText: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for the button to open dtmf dialpad
   */
  openDtmfDialpad: string;
}
