// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Strings used by the {@link CallComposite} directly.
 *
 * This strings are in addition to those used by the components from the component library.
 */
export interface CallCompositeStrings {
  /**
   * Title of configuration page.
   */
  configurationPageTitle: string;
  /**
   * Text in button to start call in configuration page.
   */
  startCallButtonText: string;
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
   * Error reason when joining a Teams meeting fails because meeting owner denied access.
   */
  teamsMeetingFailReasonAccessDenied: string;
  /**
   * Error reason when Teams meeting is disconnected because meeting owner removed the user.
   */
  teamsMeetingFailReasonParticipantRemoved: string;
  /**
   * Error shown when Teams meeting connection is dropped for some reason.
   */
  teamsMeetingFailToJoin: string;
}

/**
 * Strings used by the {@link ChatComposite} directly.
 *
 * This strings are in addition to those used by the components from the component library.
 */
export interface ChatCompositeStrings {
  /**
   * Chat list header text
   */
  chatListHeader: string;
}
