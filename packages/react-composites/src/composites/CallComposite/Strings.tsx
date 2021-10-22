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
   * Title text of the page shown to the user when they are removed from a meeting.
   */
  removedFromMeetingTitle: string;
  /**
   * More details text of the page shown to the user when they are removed from a meeting.
   */
  removedFromMeetingMoreDetails?: string;
  /**
   * Text shown to the user on the lobby screen when connecting to a call.
   */
  lobbyScreenConnectingToCallTitle: string;
  /**
   * Text shown to the user on the lobby screen when waiting to be admitted to a call.
   */
  lobbyScreenWaitingToBeAdmittedTitle: string;
  /**
   * Message to let user know they are sharing their screen.
   */
  screenSharingMessage: string;
  /**
   * Text for link to MS privacy policy in Compliance Banner.
   */
  privacyPolicy: string;
  /**
   * Text for link to learn more about a specific subject.
   */
  learnMore: string;
  /**
   * Message to let user know the meeting is only being recorded (no transcription).
   */
  nowOnlyRecording: string;
  /**
   * Message to let user know the meeting is only being transcripted (no recording).
   */
  nowOnlyTranscription: string;
  /**
   * Message to let user know recording and transcription of the meeting are saved.
   */
  recordingAndTranscriptionSaved: string;
  /**
   * Message to let user know recording and transcription of the meeting have started.
   */
  recordingAndTranscriptionStarted: string;
  /**
   * Message to let user know recording and transcription of the meeting have stopped.
   */
  recordingAndTranscriptionStopped: string;
  /**
   * Message to let user know recording of the meeting is being saved.
   */
  recordingSaving: string;
  /**
   * Message to let user know recording of the meeting has started.
   */
  recordingStarted: string;
  /**
   * Message to let user know recording of the meeting has stopped.
   */
  recordingStopped: string;
  /**
   * Message to let user know they are giving consent to meeting being transcripted.
   */
  transcriptionConsent: string;
  /**
   * Message to let user know transcription of the meeting is being saved.
   */
  transcriptionSaving: string;
  /**
   * Message to let user know transcription of the meeting has started.
   */
  trancriptionStarted: string;
  /**
   * Message to let user know the transcription of the meeting has stopped.
   */
  transcriptionStopped: string;
  /**
   * Text for close button.
   */
  close: string;
  /**
   * Message to let user know the screen another user is sharing is being loaded.
   */
  sharingScreenLoading: string;
}
