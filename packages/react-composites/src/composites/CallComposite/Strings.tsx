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
   * Message shown to the user when they are speaking while mtued.
   */
  youAreMutedMessage: string;
}
