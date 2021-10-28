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
   * Text shown to the user on the lobby screen when waiting to be admitted to a call.
   */
  lobbyScreenWaitingToBeAdmittedTitle: string;
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
  complianceBannerTrancriptionStarted: string;
  /**
   * Message to let user know the transcription of the meeting has stopped in ComplianceBanner.
   */
  complianceBannerTranscriptionStopped: string;
  /**
   * Text for close button.
   */
  close: string;
}
